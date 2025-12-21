import React, { useEffect, useState, createContext, useContext } from "react";
import { shopping_cart } from "../../local data/shopping_cart";

export const CartContext = createContext();

export const Cart_Context_Provider = ({ children }) => {
  const [cart, setCart] = useState(shopping_cart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartTotalItems, setCartTotalItems] = useState(1);

  console.log("CART AT CONTEXT: ", JSON.stringify(cart, null, 2));

  //   Calculate subtotal of cart helper function
  const calculateSubtotal = (products) => {
    return products.reduce((sum, product) => {
      const variant = product.size_variants[0];
      return sum + variant.price * variant.quantity;
    }, 0);
  };

  const extractingIDs = (item) => {
    const { id, size_variants } = item;
    const { id: variantId } = size_variants[0];
    return { productId: id, variantId };
  };

  //   const getTotalCartQuantity = (updatedCart) => {
  //     return (
  //       updatedCart?.products?.reduce((total, product) => {
  //         const quantity = product?.size_variants?.[0]?.quantity ?? 0;
  //         return total + quantity;
  //       }, 0) || 0
  //     );
  //   };

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

  const getTotalCartQuantity = (updatedCart) => {
    return (
      updatedCart?.products?.reduce((total, product) => {
        const quantity = product?.size_variants?.[0]?.quantity ?? 0;
        return total + quantity;
      }, 0) || 0
    );
  };

  const increaseCartItemQty = (item) => {
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
        "UPDATED CART AFTER INCREASE:",
        JSON.stringify(updatedCart, null, 2)
      );
      const total_items_qty = getTotalCartQuantity(updatedCart);
      setCartTotalItems(total_items_qty);
      return updatedCart;
    });
  };
  const decreaseCartItemQty = (item) => {
    setCart((prev) => {
      const products = prev?.products ?? [];

      const updatedProducts = updatingProductsQtyAtCart(
        item,
        products,
        "decrease"
      );

      const cartUpdated = {
        ...prev,
        products: updatedProducts,
        sub_total: calculateSubtotal(updatedProducts),
        updated_at: new Date().toISOString(),
      };
      const total_items_qty = getTotalCartQuantity(cartUpdated);
      setCartTotalItems(total_items_qty);

      return cartUpdated;
    });
  };

  const addingProductToCart = (
    product_to_add_to_cart,
    navigation,
    nextView
  ) => {
    setIsLoading(true);

    setTimeout(() => {
      setCart((prevCart) => {
        const products = prevCart?.products ?? [];

        const incoming = product_to_add_to_cart;
        const incomingVariant = incoming.size_variants[0];

        const existingIndex = products.findIndex((p) => {
          const v = p.size_variants?.[0];
          return p.id === incoming.id && v?.id === incomingVariant.id;
        });

        let updatedProducts;

        // 🟢 If exists → increment quantity
        if (existingIndex !== -1) {
          updatedProducts = products.map((p, idx) => {
            if (idx !== existingIndex) return p;

            const currentVariant = p.size_variants[0];
            const currentQty = currentVariant.quantity ?? 0;
            const stock = currentVariant.stock ?? Infinity;

            return {
              ...p,
              size_variants: [
                {
                  ...currentVariant,
                  quantity: Math.min(currentQty + 1, stock),
                },
              ],
            };
          });
        }
        // 🟢 If new → add product
        else {
          updatedProducts = [
            ...products,
            {
              ...incoming,
              size_variants: [
                {
                  ...incomingVariant,
                  quantity: 1,
                },
              ],
            },
          ];
        }

        // 🔢 Calculate subtotal
        console.log(
          "UPDATED PRODUCTS BEFORE CALCULATION:",
          JSON.stringify(updatedProducts, null, 2)
        );
        const sub_total = calculateSubtotal(updatedProducts);

        const cartUpdated = {
          ...prevCart,
          products: updatedProducts,
          sub_total,
          updated_at: new Date().toISOString(),
        };
        const total_items_qty = getTotalCartQuantity(cartUpdated);
        setCartTotalItems(total_items_qty);
        return cartUpdated;
        // return {
        //   ...prevCart,
        //   products: updatedProducts,
        //   sub_total,
        //   updated_at: new Date().toISOString(),
        // };
      });

      setIsLoading(false);
      navigation.navigate(nextView);
    }, 1000);
  };
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

        return {
          ...prevCart,
          products: updatedProducts,
          sub_total: calculateSubtotal(updatedProducts),
          updated_at: new Date().toISOString(),
        };
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
