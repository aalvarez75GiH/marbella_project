import React, { useEffect, useState, createContext, useContext } from "react";

// import { billing } from "firebase-functions/alerts";

import { myOrder_schema } from "./orders.local_data";
import { gettingAllOrdersByUserIDRequest } from "./orders.services";

export const OrdersContext = createContext();

export const Orders_Context_Provider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myOrder, setMyOrder] = useState(myOrder_schema);
  const [deliveryOption, setDeliveryOption] = useState(null);

  // console.log("MY ORDER AT ORDERS CONTEXT: ", JSON.stringify(myOrder, null, 2));

  useEffect(() => {
    // Fetch orders when the component mounts or when user_id changes
    const user_id = "aaa09d45-24a9-4a3f-aca5-9658952172c2"; // Replace with actual user ID from context/authentication
    if (user_id) {
      gettingAllOrdersByUserID(user_id);
    }
  }, []);

  const gettingAllOrdersByUserID = async (user_id) => {
    setIsLoading(true);
    // Implement the logic to fetch all orders by user ID
    // This is a placeholder function
    setTimeout(async () => {
      try {
        // Simulate fetching data
        const fetchedOrders = await gettingAllOrdersByUserIDRequest(user_id); // Replace with actual fetch logic
        // console.log("Fetched Orders:", JSON.stringify(fetchedOrders, null, 2));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Simulate network delay
  };

  return (
    <OrdersContext.Provider
      value={{
        isLoading,
        myOrder,
        setMyOrder,
        setIsLoading,
        deliveryOption,
        setDeliveryOption,
        gettingAllOrdersByUserID,
        orders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
