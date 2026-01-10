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
} from "./cart.services";

import { AuthenticationContext } from "../authentication/authentication.context";

export const CartContext = createContext();

export const Cart_Context_Provider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartTotalItems, setCartTotalItems] = useState(0);

  const { user } = useContext(AuthenticationContext);
  const { user_id } = user || {};

  const removingRef = useRef(false);

  useEffect(() => {
    const gettingCartByUserID = async (userId) => {
      try {
        console.log("Fetching cart for userId:", user_id);
        const myCart = await gettingCartByUserIDRequest(user_id);
        setCart(myCart);
        setCartTotalItems(myCart.quantity || 0);
        // Handle the fetched cart data (e.g., update state or context)
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    if (user_id) {
      gettingCartByUserID(user_id);
    }
  }, [user_id]);

  useEffect(() => {
    const total_items_qty = getTotalCartQuantity(cart);
    setCartTotalItems(total_items_qty);
  }, [cart]);

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
    // Optimistically update the cart locally
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
      console.log(
        "UPDATED CART AFTER INCREASE (Optimistic):",
        JSON.stringify(updatedCart, null, 2)
      );
      const total_items_qty = getTotalCartQuantity(updatedCart);
      setCartTotalItems(total_items_qty);
      return updatedCart;
    });

    // Make the backend request
    try {
      const myCart = await IncOrDecProductsCartQty(user_id, item, "increase");
      console.log("MY CART FROM API CALL:", JSON.stringify(myCart, null, 2));
      setCart(myCart); // Update the cart with the backend response
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const decreaseCartItemQty = async (item) => {
    // Optimistically update the cart locally
    setCart((prev) => {
      const products = prev?.products ?? [];

      const updatedProducts = updatingProductsQtyAtCart(
        item,
        products,
        "decrease"
      );
      const updatedCart = {
        ...prev,
        products: updatedProducts,
        sub_total: calculateSubtotal(updatedProducts),
        updated_at: new Date().toISOString(),
      };
      console.log(
        "UPDATED CART AFTER INCREASE (Optimistic):",
        JSON.stringify(updatedCart, null, 2)
      );
      const total_items_qty = getTotalCartQuantity(updatedCart);
      setCartTotalItems(total_items_qty);
      return updatedCart;
    });

    // Make the backend request
    try {
      const myCart = await IncOrDecProductsCartQty(user_id, item, "decrease");
      console.log("MY CART FROM API CALL:", JSON.stringify(myCart, null, 2));
      setCart(myCart); // Update the cart with the backend response
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  //   *** ADD product to cart in the cloud ***
  const addingProductToCart = (
    product_to_add_to_cart,
    navigation,
    nextView
  ) => {
    setIsLoading(true);

    setTimeout(async () => {
      try {
        console.log("Fetching cart for userId:", user_id);
        const myCart = await updatingProductsCart(
          user_id,
          product_to_add_to_cart
        );
        console.log("MY CART FROM API CALL:", JSON.stringify(myCart, null, 2));
        setCart(myCart);
        setCartTotalItems(myCart.quantity || 0);
        // Handle the fetched cart data (e.g., update state or context)
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
      setIsLoading(false);
      navigation.navigate(nextView);
    }, 1000);
  };

  //   *** REMOVE product from cart ***

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

    const optimisticCart = {
      ...cart,
      products: updatedProducts,
      sub_total: calculateSubtotal(updatedProducts),
      updated_at: new Date().toISOString(),
    };

    const optimisticEmpty = updatedProducts.length === 0;

    setIsLoading(true);
    setCart(optimisticCart);
    setCartTotalItems(getTotalCartQuantity(optimisticCart));

    try {
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

  return (
    <CartContext.Provider
      value={{
        isLoading,
        setIsLoading,
        addingProductToCart,
        cart,
        increaseCartItemQty,
        decreaseCartItemQty,
        removingProductFromCart,
        cartTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
