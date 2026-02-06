import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import * as Crypto from "expo-crypto";

import { STORAGE_KEYS } from "../../services/authentication/authentication.handlers";

export const generateUUID = () => Crypto.randomUUID();

import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useRef,
} from "react";
import {
  gettingCartByUserIDRequest,
  updatingProductsCart,
  IncOrDecProductsCartQty,
  removingCartItemRequest,
  resettingCartRequest,
} from "./cart.services";

import { AuthenticationContext } from "../authentication/authentication.context";

export const CartContext = createContext();

export const Cart_Context_Provider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartTotalItems, setCartTotalItems] = useState(0);
  const [isUpdatingQty, setIsUpdatingQty] = useState(false);

  const { user, authInitializing } = useContext(AuthenticationContext);
  const { user_id } = user || {};

  const removingRef = useRef(false);

  const { GUEST_CART_KEY } = STORAGE_KEYS;
  const createEmptyGuestCart = () => ({
    cart_id: generateUUID(),
    user_id: "", // stays empty for guest
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    products: [],
    sub_total: 0,
    taxes: 0,
    total: 0,
  });

  useEffect(() => {
    const total_items_qty = getTotalCartQuantity(cart);
    setCartTotalItems(total_items_qty);
  }, [cart]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (authInitializing) return;

      try {
        console.log("Cart init user_id:", user_id);

        if (user_id) {
          await gettingCartByUserID(user_id);
          return;
        }

        // ✅ immediate UI reset (stable)
        setCart({
          cart_id: "",
          user_id: "",
          createdAt: "",
          updatedAt: "",
          products: [],
          sub_total: 0,
          taxes: 0,
          total: 0,
        });

        const raw = await AsyncStorage.getItem(GUEST_CART_KEY);
        if (cancelled) return;

        if (!raw) {
          const fresh = createEmptyGuestCart();
          await AsyncStorage.setItem(GUEST_CART_KEY, JSON.stringify(fresh));
          if (cancelled) return;
          setCart(fresh);
        } else {
          setCart(JSON.parse(raw));
        }
      } catch (e) {
        console.log("Cart init error:", e);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [user_id, authInitializing]);

  // // ✅ 2) When a user appears, clear guest cart
  // useEffect(() => {
  //   const clearGuest = async () => {
  //     if (authInitializing) return;
  //     if (!user_id) return;

  //     // If you want to migrate guest items, do it here BEFORE removing
  //     await AsyncStorage.removeItem(GUEST_CART_KEY);
  //     console.log("✅ Guest cart cleared because user is logged in");
  //   };

  //   clearGuest();
  // }, [user_id, authInitializing]);

  // ✅ 3) Persist guest cart only when guest
  useEffect(() => {
    const persistGuest = async () => {
      if (!cart) return;
      if (authInitializing) return;
      if (user_id) return; // signed-in -> don't write guest cart

      await AsyncStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    };

    persistGuest();
  }, [cart, user_id, authInitializing]);

  const gettingCartByUserID = async (userId) => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        console.log("Fetching cart for userId:", user_id);
        const myCart = await gettingCartByUserIDRequest(user_id);
        setCart(myCart);
        setCartTotalItems(myCart.quantity || 0);
        // Handle the fetched cart data (e.g., update state or context)
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  //Calculate subtotal of cart helper function
  const calculateSubtotal = (products) => {
    return products.reduce((sum, product) => {
      const variant = product.size_variants[0];
      return sum + variant.price * variant.quantity;
    }, 0);
  };

  //   Extract productId and variantId from item
  const extractingIDs = (item) => {
    const { id, size_variants } = item;
    const { id: variantId } = size_variants[0];
    return { productId: id, variantId };
  };

  //   Get total quantity of items in cart
  const getTotalCartQuantity = (updatedCart) => {
    return (
      updatedCart?.products?.reduce((total, product) => {
        const quantity = product?.size_variants?.[0]?.quantity ?? 0;
        return total + quantity;
      }, 0) || 0
    );
  };

  // *** UPDATE product quantity at cart ***
  const updatingProductsQtyAtCart = (item, products, task) => {
    const { productId, variantId } = extractingIDs(item);

    const updatedProducts = products
      .map((p) => {
        const v = p?.size_variants?.[0];
        if (p.id !== productId || v?.id !== variantId) return p;

        const currentQty = Number(v.quantity ?? 0);
        const stock = Number(v.stock ?? Infinity);

        if (task === "decrease") {
          return {
            ...p,
            size_variants: [
              {
                ...v,
                quantity: Math.max(currentQty - 1, 0),
              },
            ],
          };
        }

        if (task === "increase") {
          return {
            ...p,
            size_variants: [
              {
                ...v,
                quantity: Math.min(currentQty + 1, stock),
              },
            ],
          };
        }

        return p;
      })
      // 🧹 REMOVE items with qty === 0
      .filter((p) => {
        const qty = Number(p?.size_variants?.[0]?.quantity ?? 0);
        return qty > 0;
      });

    return updatedProducts;
  };

  const increaseCartItemQty = async (item) => {
    setIsUpdatingQty(true);

    let nextCartForGuest = null;

    setCart((prev) => {
      const products = prev?.products ?? [];
      const updatedProducts = updatingProductsQtyAtCart(
        item,
        products,
        "increase"
      );

      const updatedCart = {
        ...prev,
        products: updatedProducts,
        sub_total: calculateSubtotal(updatedProducts),
        updated_at: new Date().toISOString(),
      };

      const total_items_qty = getTotalCartQuantity(updatedCart);
      setCartTotalItems(total_items_qty);

      // ✅ capture for guest persistence
      nextCartForGuest = updatedCart;

      return updatedCart;
    });

    try {
      // ✅ GUEST: save and stop
      if (!user_id) {
        // wait one tick so nextCartForGuest is set
        await new Promise((r) => setTimeout(r, 0));
        if (nextCartForGuest) {
          await AsyncStorage.setItem(
            GUEST_CART_KEY,
            JSON.stringify(nextCartForGuest)
          );
        }
        return;
      }

      // ✅ USER: backend update
      const myCart = await IncOrDecProductsCartQty(user_id, item, "increase");

      setCart((prev) => ({
        ...prev,
        ...myCart,
        products: prev?.products ?? myCart?.products ?? [],
      }));
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setIsUpdatingQty(false);
    }
  };

  const decreaseCartItemQty = async (item) => {
    setIsUpdatingQty(true);

    let nextCartForGuest = null;

    // Optimistically update the cart locally
    setCart((prev) => {
      const products = prev?.products ?? [];

      const updatedProducts = updatingProductsQtyAtCart(
        item,
        products,
        "decrease"
      );

      const sub_total = calculateSubtotal(updatedProducts);
      const taxes = Number(prev?.taxes ?? 0);

      const updatedCart = {
        ...prev,
        products: updatedProducts,
        sub_total,
        total: sub_total + taxes, // ✅ keeps total correct
        updated_at: new Date().toISOString(),
      };

      console.log(
        "UPDATED CART AFTER DECREASE (Optimistic):",
        JSON.stringify(updatedCart, null, 2)
      );

      const total_items_qty = getTotalCartQuantity(updatedCart);
      setCartTotalItems(total_items_qty);

      nextCartForGuest = updatedCart; // capture for AsyncStorage

      return updatedCart;
    });

    try {
      // ✅ GUEST: persist + stop (no backend)
      if (!user_id) {
        await new Promise((r) => setTimeout(r, 0)); // let nextCartForGuest get assigned
        if (nextCartForGuest) {
          await AsyncStorage.setItem(
            GUEST_CART_KEY,
            JSON.stringify(nextCartForGuest)
          );
        }
        return;
      }

      // ✅ USER: backend request
      const myCart = await IncOrDecProductsCartQty(user_id, item, "decrease");

      console.log("MY CART FROM API CALL:", JSON.stringify(myCart, null, 2));

      setCart((prev) => ({
        ...prev,
        ...myCart,
        products: prev?.products, // keep optimistic quantities
      }));
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setIsUpdatingQty(false);
    }
  };

  const addingProductToCart = (
    product_to_add_to_cart,
    navigation,
    nextView
  ) => {
    setIsLoading(true);

    setTimeout(async () => {
      try {
        if (user_id) {
          const myCart = await updatingProductsCart(
            user_id,
            product_to_add_to_cart
          );
          setCart(myCart);
          setCartTotalItems(myCart.quantity || 0);
        } else {
          const raw = await AsyncStorage.getItem(GUEST_CART_KEY);
          let cart = raw
            ? JSON.parse(raw)
            : {
                cart_id: Crypto.randomUUID(),
                user_id: "",
                products: [],
                sub_total: 0,
                taxes: 0,
                total: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

          const incomingVariant = product_to_add_to_cart?.size_variants?.[0];
          const incomingVariantId = incomingVariant?.id;

          const existingIndex = cart.products.findIndex((p) => {
            const v = p?.size_variants?.[0];
            return (
              p?.id === product_to_add_to_cart?.id &&
              v?.id === incomingVariantId
            );
          });

          const addQty = Number(incomingVariant?.quantity) || 1;

          if (existingIndex >= 0) {
            // ✅ increment VARIANT quantity (what your UI shows)
            const existingVariant =
              cart.products[existingIndex].size_variants?.[0];
            const currentQty = Number(existingVariant?.quantity) || 0;

            cart.products[existingIndex].size_variants[0] = {
              ...existingVariant,
              quantity: currentQty + addQty,
            };
          } else {
            // ✅ ensure the new item has a variant quantity set
            cart.products.push({
              ...product_to_add_to_cart,
              size_variants: [
                {
                  ...incomingVariant,
                  quantity: addQty,
                },
              ],
            });
          }

          // ✅ totals from variant.price * variant.quantity
          const sub_total = cart.products.reduce((sum, p) => {
            const v = p?.size_variants?.[0];
            const price = Number(v?.price) || 0;
            const qty = Number(v?.quantity) || 0;
            return sum + price * qty;
          }, 0);

          const taxes = 0;
          const total = sub_total + taxes;

          const nextCart = {
            ...cart,
            sub_total,
            taxes,
            total,
            updatedAt: new Date().toISOString(),
          };

          await AsyncStorage.setItem(GUEST_CART_KEY, JSON.stringify(nextCart));

          setCart(nextCart);

          // ✅ cart badge count should be sum of variant quantities
          const totalItems = nextCart.products.reduce((sum, p) => {
            const v = p?.size_variants?.[0];
            return sum + (Number(v?.quantity) || 0);
          }, 0);
          setCartTotalItems(totalItems);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
        navigation.navigate(nextView); // ✅ only once
      }
    }, 1000);
  };

  // *** REMOVE product from cart ***
  const removingProductFromCart = async (item) => {
    if (removingRef.current) return { ok: false, becameEmpty: false };
    removingRef.current = true;

    const { productId, variantId } = extractingIDs(item);

    // compute next products from current cart
    const prevProducts = cart?.products ?? [];
    const updatedProducts = prevProducts.filter((p) => {
      const v = p?.size_variants?.[0];
      return !(p.id === productId && v?.id === variantId);
    });

    const sub_total = calculateSubtotal(updatedProducts);
    const taxes = Number(cart?.taxes ?? 0);

    const optimisticCart = {
      ...cart,
      products: updatedProducts,
      sub_total,
      total: sub_total + taxes, // ✅ keep total updated
      updated_at: new Date().toISOString(),
    };

    const optimisticEmpty = updatedProducts.length === 0;

    setIsLoading(true);
    setCart(optimisticCart);
    setCartTotalItems(getTotalCartQuantity(optimisticCart));

    try {
      // ✅ GUEST: persist + stop (no backend call)
      if (!user_id) {
        await AsyncStorage.setItem(
          GUEST_CART_KEY,
          JSON.stringify(optimisticCart)
        );
        return { ok: true, becameEmpty: optimisticEmpty };
      }

      // ✅ USER: backend request
      const myCart = await removingCartItemRequest(
        user_id,
        productId,
        variantId
      );

      if (myCart) {
        setCart(myCart);
        setCartTotalItems(getTotalCartQuantity(myCart));
        return { ok: true, becameEmpty: (myCart?.products?.length ?? 0) === 0 };
      }

      // if API didn't return a cart, fall back to optimistic result
      return { ok: true, becameEmpty: optimisticEmpty };
    } catch (error) {
      console.error("Error updating cart:", error);
      return { ok: false, becameEmpty: false };
    } finally {
      setIsLoading(false);
      removingRef.current = false;
    }
  };

  const resettingCart = async (user_id) => {
    console.log("Resetting cart for user_id at context:", user_id);

    try {
      // ✅ GUEST: reset AsyncStorage cart
      if (!user_id) {
        const emptyGuestCart = {
          cart_id: Crypto.randomUUID(),
          user_id: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          products: [],
          sub_total: 0,
          taxes: 0,
          total: 0,
        };

        await AsyncStorage.setItem(
          GUEST_CART_KEY,
          JSON.stringify(emptyGuestCart)
        );
        setCart(emptyGuestCart);
        setCartTotalItems(0);
        return;
      }

      // ✅ USER: reset in backend
      const cartReset = await resettingCartRequest(user_id);
      if (cartReset) {
        setCart(cartReset);
        setCartTotalItems(getTotalCartQuantity(cartReset)); // optional but recommended
      }
    } catch (error) {
      console.error("Error resetting cart:", error);
      setError(error);
    }
  };

  console.log("CART AT CONTEXT:", JSON.stringify(cart, null, 2));

  const clearGuestCart = async () => {
    await AsyncStorage.removeItem(GUEST_CART_KEY);
  };

  const resetCartContext = () => {
    setCart(null);
    setCartTotalItems(0);
    setIsLoading(false);
    setIsUpdatingQty(false);
  };

  return (
    <CartContext.Provider
      value={{
        isLoading,
        setIsLoading,
        addingProductToCart,
        cart,
        setCart,
        increaseCartItemQty,
        decreaseCartItemQty,
        removingProductFromCart,
        cartTotalItems,
        setCartTotalItems,
        resettingCart,
        gettingCartByUserID,
        isUpdatingQty,
        clearGuestCart,
        getTotalCartQuantity,
        resetCartContext,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
