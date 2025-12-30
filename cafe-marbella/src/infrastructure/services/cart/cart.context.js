import React, { useEffect, useState, createContext, useContext } from "react";
import { shopping_cart } from "../../local data/shopping_cart";
import { products as catalogProducts } from "../../local data/products";
import {
  gettingCartByUserIDRequest,
  updatingProductsCart,
  IncOrDecProductsCartQty,
} from "./cart.services";

import { AuthenticationContext } from "../authentication/authentication.context";

export const CartContext = createContext();

export const Cart_Context_Provider = ({ children }) => {
  const [cart, setCart] = useState(shopping_cart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartTotalItems, setCartTotalItems] = useState(0);

  const { user } = useContext(AuthenticationContext);
  const { user_id } = user || {};
  console.log("USER AT CART CONTEXT: ", JSON.stringify(user, null, 2));
  // const userId = user?.user_id;
  console.log("USER ID AT CART CONTEXT: ", user_id);

  // useEffect(() => {
  //   const gettingCartByUserID = async (userId) => {
  //     const myCart = await gettingCartByUserIDRequest(userId);
  //     console.log("MY CART FROM API CALL:", JSON.stringify(myCart, null, 2));
  //     // Simulate fetching cart data for the user
  //     // In a real app, replace this with an API call
  //     console.log("Fetching cart for user ID:", userId);
  //     return shopping_cart; // returning local data for simulation
  //   };
  //   gettingCartByUserID(userId);
  // }, []);
  useEffect(() => {
    const gettingCartByUserID = async (userId) => {
      try {
        console.log("Fetching cart for userId:", user_id);
        const myCart = await gettingCartByUserIDRequest(user_id);
        console.log(
          "MY CART FROM API CALL:",
          JSON.stringify(myCart[0], null, 2)
        );
        // setCart(myCart[0]);
        setCart(myCart);
        setCartTotalItems(
          myCart.quantity || 0
          // myCart[0].products[0]?.size_variants[0]?.quantity || 0
        );
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

  console.log("CART AT CONTEXT: ", JSON.stringify(cart, null, 2));

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

  //   //   *** UPDATE product quantity at cart ***
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

  // Increase cart item quantity
  const increaseCartItemQty = async (item) => {
    try {
      const myCart = await IncOrDecProductsCartQty(user_id, item, "increase");
      console.log("MY CART FROM API CALL:", JSON.stringify(myCart, null, 2));
      setCart(myCart);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };
  // Increase cart item quantity
  const decreaseCartItemQty = async (item) => {
    try {
      const myCart = await IncOrDecProductsCartQty(user_id, item, "decrease");
      console.log("MY CART FROM API CALL:", JSON.stringify(myCart, null, 2));
      setCart(myCart);
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
        const total_items_qty = getTotalCartQuantity(myCart);
        setCartTotalItems(total_items_qty);
        // setCartTotalItems(myCart.products[0]?.size_variants[0]?.quantity || 0);
        // Handle the fetched cart data (e.g., update state or context)
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
      setIsLoading(false);
      navigation.navigate(nextView);
    }, 1000);
  };

  //   *** REMOVE product from cart ***
  const removingProductFromCart = (item) => {
    const { productId, variantId } = extractingIDs(item);
    setIsLoading(true);
    setTimeout(() => {
      setCart((prevCart) => {
        const products = prevCart?.products ?? [];

        const updatedProducts = products.filter((p) => {
          const v = p?.size_variants?.[0];
          return !(p.id === productId && v?.id === variantId);
        });
        const cartUpdated = {
          ...prevCart,
          products: updatedProducts,
          sub_total: calculateSubtotal(updatedProducts),
          updated_at: new Date().toISOString(),
        };
        const total_items_qty = getTotalCartQuantity(cartUpdated);
        setCartTotalItems(total_items_qty);

        return cartUpdated;
      });
      setIsLoading(false);
    }, 500);
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
