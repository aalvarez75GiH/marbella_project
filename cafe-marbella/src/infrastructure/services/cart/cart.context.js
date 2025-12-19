import React, { useEffect, useState, createContext, useContext } from "react";
import { shopping_cart } from "../../local data/shopping_cart";

export const CartContext = createContext();

export const Cart_Context_Provider = ({ children }) => {
  const [cart, setCart] = useState(shopping_cart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("CART AT CONTEXT: ", JSON.stringify(cart, null, 2));

  const addingProductToCart = (
    product_to_add_to_cart,
    navigation,
    nextView,
    selectedVariant
  ) => {
    setIsLoading(true);

    const calculateSubtotal = (products) =>
      products.reduce((sum, product) => {
        const variant = product.size_variants[0];
        return sum + variant.price * variant.quantity;
      }, 0);

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

        return {
          ...prevCart,
          products: updatedProducts,
          sub_total,
          updated_at: new Date().toISOString(),
        };
      });

      setIsLoading(false);
      navigation.navigate(nextView);
    }, 1000);
  };

  return (
    <CartContext.Provider
      value={{
        isLoading,
        setIsLoading,
        addingProductToCart,
        cart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
