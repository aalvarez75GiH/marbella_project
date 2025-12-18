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
    nextView
  ) => {
    setIsLoading(true);

    setTimeout(() => {
      setCart((prevCart) => ({
        ...prevCart,
        products: [...prevCart.products, product_to_add_to_cart], // Add the new product to the array
        updated_at: new Date().toISOString(), // Update the timestamp
      }));

      setIsLoading(false); // Stop the loading state

      // Navigate to the next view
      navigation.navigate(nextView);
    }, 1000); // Simulate a network request delay
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
