import React, { useEffect, useState, createContext, useContext } from "react";

// import { billing } from "firebase-functions/alerts";

import { myOrder_schema } from "./orders.local_data";

export const OrdersContext = createContext();

export const Orders_Context_Provider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myOrder, setMyOrder] = useState(myOrder_schema);
  const [deliveryOption, setDeliveryOption] = useState(null);

  console.log("MY ORDER AT ORDERS CONTEXT: ", JSON.stringify(myOrder, null, 2));
  return (
    <OrdersContext.Provider
      value={{
        isLoading,
        myOrder,
        setMyOrder,
        setIsLoading,
        deliveryOption,
        setDeliveryOption,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
