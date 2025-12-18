import React, { useEffect, useState, createContext, useContext } from "react";

export const ShopContext = createContext();

export const Orders_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <ShopContext.Provider
      value={{
        isLoading,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
