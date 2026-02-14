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
  upsertCartRequest,
} from "./cart.services";

import { AuthenticationContext } from "../authentication/authentication.context";

export const CartContext = createContext();

export const Cart_Context_Provider = ({ children }) => {
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
  const [cart, setCart] = useState(() => createEmptyGuestCart());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartTotalItems, setCartTotalItems] = useState(0);
  const [isUpdatingQty, setIsUpdatingQty] = useState(false);

  const { user, authInitializing } = useContext(AuthenticationContext);
  const { user_id } = user || {};

  const removingRef = useRef(false);
  const cartInitLockRef = useRef(false);

  const lockCartInit = (locked) => {
    cartInitLockRef.current = locked;
  };
  useEffect(() => {
    console.log("CartProvider mounted");
    return () => console.log("CartProvider unmounted");
  }, []);

  useEffect(() => {
    console.log("CartProvider cart changed:", cart ? "HAS_CART" : String(cart));
  }, [cart]);

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

        const isValidUserId =
          typeof user_id === "string" && user_id.trim().length > 0;

        // ✅ If login flow is merging, don't let init overwrite it
        if (cartInitLockRef.current) {
          console.log("Cart init: locked, skip");
          return;
        }

        if (isValidUserId) {
          await gettingCartByUserID(user_id); // must be safe and never set undefined
          return;
        }

        // Guest: load from storage (no reset-to-empty first)
        const raw = await AsyncStorage.getItem(GUEST_CART_KEY);
        if (cancelled) return;

        if (!raw) {
          const fresh = createEmptyGuestCart();
          await AsyncStorage.setItem(GUEST_CART_KEY, JSON.stringify(fresh));
          if (cancelled) return;
          setCart(fresh);
        } else {
          const parsed = JSON.parse(raw);
          setCart(parsed ?? createEmptyGuestCart());
        }
      } catch (e) {
        console.log("Cart init error:", e);
        setCart(createEmptyGuestCart()); // ✅ never undefined
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [user_id, authInitializing]);

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

  const createEmptyUserCart = (userId) => ({
    cart_id: userId, // or keep your cart_id field if you want
    user_id: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    products: [],
    sub_total: 0,
    taxes: 0,
    total: 0,
  });

  const gettingCartByUserID = async (userId, { setState = true } = {}) => {
    const isValid = typeof userId === "string" && userId.trim().length > 0;
    if (!isValid) {
      console.log("gettingCartByUserID: blocked invalid userId:", userId);
      return null;
    }

    setIsLoading(true);
    try {
      const myCart = await gettingCartByUserIDRequest(userId);

      const safeCart = myCart ?? createEmptyUserCart(userId);

      if (setState) {
        setCart(safeCart);
        setCartTotalItems(getTotalCartQuantity(safeCart)); // ✅ don’t use myCart.quantity
      }

      return safeCart;
    } catch (error) {
      console.error("Error fetching cart:", error);

      const safeCart = createEmptyUserCart(userId);
      if (setState) {
        setCart(safeCart); // ✅ never set undefined
        setCartTotalItems(0);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
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

      // console.log("MY CART FROM API CALL:", JSON.stringify(myCart, null, 2));

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
          setCart(myCart ?? createEmptyGuestCart());
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
    // console.log("Resetting cart for user_id at context:", user_id);

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

  // console.log("CART AT CONTEXT:", JSON.stringify(cart, null, 2));

  const clearGuestCart = async () => {
    await AsyncStorage.removeItem(GUEST_CART_KEY);
  };

  const resetCartContext = () => {
    setCart(null);
    setCartTotalItems(0);
    setIsLoading(false);
    setIsUpdatingQty(false);
  };

  // mergeCartGuestOverridesDb.js
  const mergeCartGuestOverridesDb = (dbCart, guestCart, user_id) => {
    const base = {
      ...(dbCart ?? {}),
      user_id,
      cart_id: dbCart?.cart_id ?? guestCart?.cart_id,
      createdAt: dbCart?.createdAt ?? guestCart?.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const dbProducts = dbCart?.products ?? [];
    const guestProducts = guestCart?.products ?? [];

    const map = new Map();

    // 1) start with DB
    for (const p of dbProducts) {
      const v = p?.size_variants?.[0];
      const key = `${p.id}::${v?.id ?? "no-variant"}`;
      map.set(key, p);
    }

    // 2) guest overrides
    for (const p of guestProducts) {
      const v = p?.size_variants?.[0];
      const key = `${p.id}::${v?.id ?? "no-variant"}`;
      map.set(key, p); // override
    }

    const mergedProducts = Array.from(map.values());

    const sub_total = calculateSubtotal(mergedProducts);
    const taxes = Number(dbCart?.taxes ?? 0); // or 0, or compute later
    const total = sub_total + taxes;

    // recompute pricing if you have helpers; otherwise keep guest totals as source of truth
    console.log("BASE CART:", JSON.stringify(base, null, 2));
    console.log("MERGED PRODUCTS:", JSON.stringify(mergedProducts, null, 2));
    return {
      ...base,
      products: mergedProducts,
      sub_total,
      taxes,
      total,
    };
  };

  //This function can be used for merging guest cart with DB cart,
  //backend will handle the logic based on if cart_id exists or not
  const upsertCart = async (nextCart) => {
    const saved = await upsertCartRequest(nextCart);

    const safe = saved ?? nextCart ?? createEmptyGuestCart();

    setCart(safe);
    setCartTotalItems(getTotalCartQuantity(safe));
    console.log(
      "upsertCartRequest returned:",
      saved ? "HAS_DATA" : String(saved)
    );

    return safe;
  };

  const saveCartAsGuest = async (userCart) => {
    const nextGuestCart = {
      ...createEmptyGuestCart(),
      // keep products + totals from user cart
      products: cart?.products ?? [],
      sub_total: Number(cart?.sub_total ?? 0),
      taxes: Number(cart?.taxes ?? 0),
      total: Number(cart?.total ?? 0),
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(GUEST_CART_KEY, JSON.stringify(nextGuestCart));
    setCart(nextGuestCart);
    setCartTotalItems(getTotalCartQuantity(nextGuestCart));
    return nextGuestCart;
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
        mergeCartGuestOverridesDb,
        upsertCart,
        lockCartInit,
        saveCartAsGuest,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
