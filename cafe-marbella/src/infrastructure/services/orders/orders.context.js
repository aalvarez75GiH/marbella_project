import React, { useEffect, useState, createContext, useContext } from "react";

export const OrdersContext = createContext();

export const Orders_Context_Provider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <OrdersContext.Provider
      value={{
        isLoading,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
