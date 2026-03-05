import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

import { STORAGE_KEYS } from "../../services/authentication/authentication.handlers";

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

export const generateUUID = () => Crypto.randomUUID();

export const Cart_Context_Provider = ({ children }) => {
  const { GUEST_CART_KEY } = STORAGE_KEYS;

  const createEmptyGuestCart = useCallback(
    () => ({
      cart_id: generateUUID(),
      user_id: "", // stays empty for guest
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      products: [],
      sub_total: 0,
      taxes: 0,
      total: 0,
    }),
    []
  );

  const createEmptyUserCart = useCallback((userId) => {
    const now = new Date().toISOString();
    return {
      cart_id: userId, // or keep your cart_id field if you want
      user_id: userId,
      createdAt: now,
      updatedAt: now,
      products: [],
      sub_total: 0,
      taxes: 0,
      total: 0,
    };
  }, []);

  // ✅ stable helper (so memo/callback deps don't churn)
  const getTotalCartQuantity = useCallback((updatedCart) => {
    return (
      updatedCart?.products?.reduce((total, product) => {
        const quantity = product?.size_variants?.[0]?.quantity ?? 0;
        return total + quantity;
      }, 0) || 0
    );
  }, []);

  const calculateSubtotal = useCallback((products) => {
    return (products ?? []).reduce((sum, product) => {
      const variant = product?.size_variants?.[0];
      const price = Number(variant?.price ?? 0);
      const qty = Number(variant?.quantity ?? 0);
      return sum + price * qty;
    }, 0);
  }, []);

  const extractingIDs = useCallback((item) => {
    const { id, size_variants } = item ?? {};
    const { id: variantId } = (size_variants ?? [])[0] ?? {};
    return { productId: id, variantId };
  }, []);

  const updatingProductsQtyAtCart = useCallback(
    (item, products, task) => {
      const { productId, variantId } = extractingIDs(item);

      const updatedProducts = (products ?? [])
        .map((p) => {
          const v = p?.size_variants?.[0];
          if (p?.id !== productId || v?.id !== variantId) return p;

          const currentQty = Number(v?.quantity ?? 0);
          const stock = Number(v?.stock ?? Infinity);

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
        .filter((p) => {
          const qty = Number(p?.size_variants?.[0]?.quantity ?? 0);
          return qty > 0;
        });

      return updatedProducts;
    },
    [extractingIDs]
  );

  const [cart, setCart] = useState(() => createEmptyGuestCart());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdatingQty, setIsUpdatingQty] = useState(false);

  const { user, profileReady } = useContext(AuthenticationContext);
  const user_id = user?.user_id;

  const removingRef = useRef(false);
  const cartInitLockRef = useRef(false);

  const lockCartInit = useCallback((locked) => {
    cartInitLockRef.current = locked;
  }, []);

  // ✅ Derived, no extra re-render
  const cartTotalItems = useMemo(
    () => getTotalCartQuantity(cart),
    [cart, getTotalCartQuantity]
  );

  useEffect(() => {
    console.log("CartProvider mounted");
    return () => console.log("CartProvider unmounted");
  }, []);

  useEffect(() => {
    console.log("CartProvider cart changed:", cart ? "HAS_CART" : String(cart));
  }, [cart]);

  // ✅ Init cart after auth/profile hydration is finished
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!profileReady) return;

      try {
        console.log("Cart init user_id:", user_id);

        if (cartInitLockRef.current) {
          console.log("Cart init: locked, skip");
          return;
        }

        const isValidUserId =
          typeof user_id === "string" && user_id.trim().length > 0;

        if (isValidUserId) {
          setIsLoading(true);
          try {
            const myCart = await gettingCartByUserIDRequest(user_id);
            const safe = myCart ?? createEmptyUserCart(user_id);
            if (!cancelled) setCart(safe);
          } finally {
            if (!cancelled) setIsLoading(false);
          }
          return;
        }

        // Guest: load from storage
        const raw = await AsyncStorage.getItem(GUEST_CART_KEY);
        if (cancelled) return;

        if (!raw) {
          const fresh = createEmptyGuestCart();
          await AsyncStorage.setItem(GUEST_CART_KEY, JSON.stringify(fresh));
          if (!cancelled) setCart(fresh);
        } else {
          const parsed = JSON.parse(raw);
          if (!cancelled) setCart(parsed ?? createEmptyGuestCart());
        }
      } catch (e) {
        console.log("Cart init error:", e?.message ?? e);
        if (!cancelled) setCart(createEmptyGuestCart());
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [
    user_id,
    profileReady,
    GUEST_CART_KEY,
    createEmptyGuestCart,
    createEmptyUserCart,
  ]);

  // ✅ Persist guest cart only when hydration is done + still guest
  useEffect(() => {
    const persistGuest = async () => {
      if (!cart) return;
      if (!profileReady) return;
      if (user_id) return;

      try {
        await AsyncStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
      } catch (e) {
        console.log("Persist guest cart failed:", e?.message ?? e);
      }
    };

    persistGuest();
  }, [cart, user_id, profileReady, GUEST_CART_KEY]);

  const gettingCartByUserID = useCallback(
    async (userId, { setState = true } = {}) => {
      const isValid = typeof userId === "string" && userId.trim().length > 0;
      if (!isValid) {
        console.log("gettingCartByUserID: blocked invalid userId:", userId);
        return null;
      }

      setIsLoading(true);
      try {
        const myCart = await gettingCartByUserIDRequest(userId);
        const safeCart = myCart ?? createEmptyUserCart(userId);

        if (setState) setCart(safeCart);
        return safeCart;
      } catch (e) {
        console.error("Error fetching cart:", e);
        const safeCart = createEmptyUserCart(userId);
        if (setState) setCart(safeCart);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [createEmptyUserCart]
  );

  const increaseCartItemQty = useCallback(
    async (item) => {
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

        nextCartForGuest = updatedCart;
        return updatedCart;
      });

      try {
        // Guest
        if (!user_id) {
          await new Promise((r) => setTimeout(r, 0));
          if (nextCartForGuest) {
            await AsyncStorage.setItem(
              GUEST_CART_KEY,
              JSON.stringify(nextCartForGuest)
            );
          }
          return;
        }

        // User
        const myCart = await IncOrDecProductsCartQty(user_id, item, "increase");
        setCart((prev) => ({
          ...prev,
          ...myCart,
          products: prev?.products ?? myCart?.products ?? [],
        }));
      } catch (e) {
        console.error("Error updating cart:", e);
      } finally {
        setIsUpdatingQty(false);
      }
    },
    [user_id, updatingProductsQtyAtCart, calculateSubtotal, GUEST_CART_KEY]
  );

  const decreaseCartItemQty = useCallback(
    async (item) => {
      setIsUpdatingQty(true);

      let nextCartForGuest = null;

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
          taxes,
          total: sub_total + taxes,
          updated_at: new Date().toISOString(),
        };

        nextCartForGuest = updatedCart;
        return updatedCart;
      });

      try {
        // Guest
        if (!user_id) {
          await new Promise((r) => setTimeout(r, 0));
          if (nextCartForGuest) {
            await AsyncStorage.setItem(
              GUEST_CART_KEY,
              JSON.stringify(nextCartForGuest)
            );
          }
          return;
        }

        // User
        const myCart = await IncOrDecProductsCartQty(user_id, item, "decrease");
        setCart((prev) => ({
          ...prev,
          ...myCart,
          products: prev?.products, // keep optimistic quantities
        }));
      } catch (e) {
        console.error("Error updating cart:", e);
      } finally {
        setIsUpdatingQty(false);
      }
    },
    [user_id, updatingProductsQtyAtCart, calculateSubtotal, GUEST_CART_KEY]
  );

  const addingProductToCart = useCallback(
    (product_to_add_to_cart, navigation, nextView) => {
      setIsLoading(true);

      setTimeout(async () => {
        try {
          if (user_id) {
            const myCart = await updatingProductsCart(
              user_id,
              product_to_add_to_cart
            );
            setCart(myCart ?? createEmptyGuestCart());
          } else {
            const raw = await AsyncStorage.getItem(GUEST_CART_KEY);
            const existing = raw ? JSON.parse(raw) : createEmptyGuestCart();

            const incomingVariant = product_to_add_to_cart?.size_variants?.[0];
            const incomingVariantId = incomingVariant?.id;
            const addQty = Number(incomingVariant?.quantity) || 1;

            const products = existing?.products ?? [];
            const existingIndex = products.findIndex((p) => {
              const v = p?.size_variants?.[0];
              return (
                p?.id === product_to_add_to_cart?.id &&
                v?.id === incomingVariantId
              );
            });

            let nextProducts = [...products];

            if (existingIndex >= 0) {
              const p = nextProducts[existingIndex];
              const v = p?.size_variants?.[0] ?? {};
              const currentQty = Number(v?.quantity) || 0;

              nextProducts[existingIndex] = {
                ...p,
                size_variants: [
                  {
                    ...v,
                    quantity: currentQty + addQty,
                  },
                ],
              };
            } else {
              nextProducts.push({
                ...product_to_add_to_cart,
                size_variants: [
                  {
                    ...incomingVariant,
                    quantity: addQty,
                  },
                ],
              });
            }

            const sub_total = calculateSubtotal(nextProducts);
            const taxes = Number(existing?.taxes ?? 0);
            const total = sub_total + taxes;

            const nextCart = {
              ...existing,
              products: nextProducts,
              sub_total,
              taxes,
              total,
              updatedAt: new Date().toISOString(),
            };

            await AsyncStorage.setItem(
              GUEST_CART_KEY,
              JSON.stringify(nextCart)
            );
            setCart(nextCart);
          }
        } catch (e) {
          console.error("Error adding product to cart:", e);
        } finally {
          setIsLoading(false);
          navigation.navigate(nextView);
        }
      }, 1000);
    },
    [user_id, calculateSubtotal, GUEST_CART_KEY, createEmptyGuestCart]
  );

  const removingProductFromCart = useCallback(
    async (item) => {
      if (removingRef.current) return { ok: false, becameEmpty: false };
      removingRef.current = true;

      const { productId, variantId } = extractingIDs(item);

      const prevProducts = cart?.products ?? [];
      const updatedProducts = prevProducts.filter((p) => {
        const v = p?.size_variants?.[0];
        return !(p?.id === productId && v?.id === variantId);
      });

      const sub_total = calculateSubtotal(updatedProducts);
      const taxes = Number(cart?.taxes ?? 0);

      const optimisticCart = {
        ...cart,
        products: updatedProducts,
        sub_total,
        taxes,
        total: sub_total + taxes,
        updated_at: new Date().toISOString(),
      };

      const optimisticEmpty = updatedProducts.length === 0;

      setIsLoading(true);
      setCart(optimisticCart);

      try {
        // Guest
        if (!user_id) {
          await AsyncStorage.setItem(
            GUEST_CART_KEY,
            JSON.stringify(optimisticCart)
          );
          return { ok: true, becameEmpty: optimisticEmpty };
        }

        // User
        const myCart = await removingCartItemRequest(
          user_id,
          productId,
          variantId
        );
        if (myCart) {
          setCart(myCart);
          return {
            ok: true,
            becameEmpty: (myCart?.products?.length ?? 0) === 0,
          };
        }

        return { ok: true, becameEmpty: optimisticEmpty };
      } catch (e) {
        console.error("Error removing cart item:", e);
        return { ok: false, becameEmpty: false };
      } finally {
        setIsLoading(false);
        removingRef.current = false;
      }
    },
    [cart, user_id, extractingIDs, calculateSubtotal, GUEST_CART_KEY]
  );

  const resettingCart = useCallback(
    async (uid) => {
      try {
        if (!uid) {
          const emptyGuest = createEmptyGuestCart();
          await AsyncStorage.setItem(
            GUEST_CART_KEY,
            JSON.stringify(emptyGuest)
          );
          setCart(emptyGuest);
          return;
        }

        const cartReset = await resettingCartRequest(uid);
        if (cartReset) setCart(cartReset);
      } catch (e) {
        console.error("Error resetting cart:", e);
        setError(e);
      }
    },
    [createEmptyGuestCart, GUEST_CART_KEY]
  );

  const clearGuestCart = useCallback(async () => {
    await AsyncStorage.removeItem(GUEST_CART_KEY);
  }, [GUEST_CART_KEY]);

  const resetCartContext = useCallback(() => {
    setCart(null);
    setIsLoading(false);
    setIsUpdatingQty(false);
  }, []);

  const mergeCartGuestOverridesDb = useCallback(
    (dbCart, guestCart, uid) => {
      const base = {
        ...(dbCart ?? {}),
        user_id: uid,
        cart_id: dbCart?.cart_id ?? guestCart?.cart_id,
        createdAt: dbCart?.createdAt ?? guestCart?.createdAt,
        updatedAt: new Date().toISOString(),
      };

      const dbProducts = dbCart?.products ?? [];
      const guestProducts = guestCart?.products ?? [];
      const map = new Map();

      for (const p of dbProducts) {
        const v = p?.size_variants?.[0];
        const key = `${p?.id}::${v?.id ?? "no-variant"}`;
        map.set(key, p);
      }
      for (const p of guestProducts) {
        const v = p?.size_variants?.[0];
        const key = `${p?.id}::${v?.id ?? "no-variant"}`;
        map.set(key, p);
      }

      const mergedProducts = Array.from(map.values());
      const sub_total = calculateSubtotal(mergedProducts);
      const taxes = Number(dbCart?.taxes ?? 0);
      const total = sub_total + taxes;

      return { ...base, products: mergedProducts, sub_total, taxes, total };
    },
    [calculateSubtotal]
  );

  const upsertCart = useCallback(
    async (nextCart) => {
      const saved = await upsertCartRequest(nextCart);
      const safe = saved ?? nextCart ?? createEmptyGuestCart();

      setCart(safe);

      console.log(
        "upsertCartRequest returned:",
        saved ? "HAS_DATA" : String(saved)
      );
      return safe;
    },
    [createEmptyGuestCart]
  );

  const saveCartAsGuest = useCallback(async () => {
    const nextGuestCart = {
      ...createEmptyGuestCart(),
      products: cart?.products ?? [],
      sub_total: Number(cart?.sub_total ?? 0),
      taxes: Number(cart?.taxes ?? 0),
      total: Number(cart?.total ?? 0),
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(GUEST_CART_KEY, JSON.stringify(nextGuestCart));
    setCart(nextGuestCart);
    return nextGuestCart;
  }, [cart, createEmptyGuestCart, GUEST_CART_KEY]);

  const value = useMemo(
    () => ({
      isLoading,
      setIsLoading,
      cart,
      setCart,
      cartTotalItems,
      isUpdatingQty,
      error,

      addingProductToCart,
      increaseCartItemQty,
      decreaseCartItemQty,
      removingProductFromCart,

      resettingCart,
      gettingCartByUserID,

      clearGuestCart,
      getTotalCartQuantity,
      resetCartContext,
      mergeCartGuestOverridesDb,
      upsertCart,
      lockCartInit,
      saveCartAsGuest,
    }),
    [
      isLoading,
      cart,
      cartTotalItems,
      isUpdatingQty,
      error,
      addingProductToCart,
      increaseCartItemQty,
      decreaseCartItemQty,
      removingProductFromCart,
      resettingCart,
      gettingCartByUserID,
      clearGuestCart,
      getTotalCartQuantity,
      resetCartContext,
      mergeCartGuestOverridesDb,
      upsertCart,
      lockCartInit,
      saveCartAsGuest,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
