import React, { useEffect, useState, createContext } from "react";

import { myOrder_schema } from "./orders.local_data";
import {
  gettingAllOrdersByUserIDRequest,
  gettingAllOrdersByUserIDGroupedByMonthRequest,
} from "./orders.services";

import { onTaxes } from "../payments/payments.services";

export const OrdersContext = createContext();

export const Orders_Context_Provider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [ordersGrouped, setOrdersGrouped] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myOrder, setMyOrder] = useState(myOrder_schema);
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [differentAddress, setDifferentAddress] = useState("");

  useEffect(() => {
    // Fetch orders when the component mounts or when user_id changes
    const user_id = "aaa09d45-24a9-4a3f-aca5-9658952172c2"; // Replace with actual user ID from context/authentication
    if (user_id) {
      gettingAllOrdersByUserID(user_id);
      gettingAllOrdersByUserIDGroupedByMonth(user_id);
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
  const gettingAllOrdersByUserIDGroupedByMonth = async (user_id) => {
    setIsLoading(true);
    // Implement the logic to fetch all orders by user ID
    // This is a placeholder function
    setTimeout(async () => {
      try {
        // Simulate fetching data
        const fetchedOrdersGrouped =
          await gettingAllOrdersByUserIDGroupedByMonthRequest(user_id); // Replace with actual fetch logic
        // console.log(
        //   "Fetched Orders Grouped:",
        //   JSON.stringify(fetchedOrdersGrouped, null, 2)
        // );
        // console.log("Fetched Orders:", JSON.stringify(fetchedOrders, null, 2));
        setOrdersGrouped(fetchedOrdersGrouped);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Simulate network delay
  };

  console.log(
    "DIFFERENT ADDRESS AT ORDERS CONTEXT: ",
    JSON.stringify(differentAddress, null, 2)
  );
  const handlingDeliveryOption = async ({
    navigation,
    onTaxes,
    differentAddress,
    customer_address,
  }) => {
    console.log(
      "DIFFERENT ADDRESS AT HANDLING: ",
      JSON.stringify(differentAddress, null, 2)
    );
    setIsLoading(true);
    // setDeliveryOption("delivery");

    try {
      // 1) Prepare nextOrder with changes
      const nextOrder = {
        ...myOrder,
        order_delivery_address: differentAddress || customer_address,
      };
      // 2) Call taxes with the order you JUST built
      const taxesResults = await onTaxes(nextOrder);
      console.log(
        "Taxes Results (DELIVERY):",
        JSON.stringify(taxesResults, null, 2)
      );

      // Optional: guard if your onTaxes returns an error shape instead of throwing
      if (taxesResults?.error || taxesResults?.status === "failed") {
        throw new Error(taxesResults?.error?.message || "Tax quote failed");
      }

      // 3) Build final order with Stripe totals
      const orderWithTaxes = {
        ...nextOrder,
        pricing: {
          ...nextOrder.pricing,
          taxes: taxesResults.tax_amount,
          total: taxesResults.total_amount,
        },
        tax_calculation_id: taxesResults.calculation_id,
      };

      // 4) Set it once
      setMyOrder(orderWithTaxes);

      // 5) Navigate (same style as pickup)
      navigation.navigate("Shop_Order_Review_View", {
        order: orderWithTaxes,
      });
    } catch (error) {
      console.log("DELIVERY TAX FLOW ERROR:", error?.message || error);
      // show alert/toast if you want
    } finally {
      // 6) Always stop loader
      setIsLoading(false);
    }

    return;
  };
  const handlingPickupOption = async ({
    navigation,
    onTaxes,
    user_id,
    cart_id,
    products,
    sub_total,
    quantity,
    warehouse_id,
    warehouse_name,
    formatted_address,
    geo,
    phone,
    warehouse_information,
    distance_in_miles,
    distance_time,
    coming_from,
    warehouse_distance_range_positive,
    nextOrder,
  }) => {
    setIsLoading(true);
    setDeliveryOption("pickup");

    try {
      const enrichedOrder = {
        ...nextOrder,
        user_id,
        cart_id,
        order_products: products,
        pricing: {
          sub_total: sub_total,
          taxes: 0,
          total: 0,
          shipping: 0,
          discount: 0,
        },
        quantity,
        warehouse_to_pickup: {
          warehouse_id,
          name: warehouse_name,
          warehouse_address: formatted_address,
          geo,
          phone_number: phone,
          closing_time: warehouse_information?.closing_time,
          opening_time: warehouse_information?.opening_time,
          distance_in_miles,
        },
        order_delivery_address: "",
      };

      console.log(
        "NEXT ORDER SENT TO TAX:",
        JSON.stringify(enrichedOrder, null, 2)
      );

      const taxesResults = await onTaxes(enrichedOrder);
      console.log("Taxes Results:", JSON.stringify(taxesResults, null, 2));

      // If your onTaxes returns { ok: false } or { status !== 200 }, handle it:
      if (taxesResults?.error || taxesResults?.status === "failed") {
        throw new Error(taxesResults?.error?.message || "Tax quote failed");
      }

      const orderWithTaxes = {
        ...enrichedOrder,
        pricing: {
          ...enrichedOrder.pricing,
          taxes: taxesResults.tax_amount,
          total: taxesResults.total_amount,
        },
        tax_calculation_id: taxesResults.calculation_id,
      };

      setMyOrder(orderWithTaxes);

      if (warehouse_distance_range_positive) {
        navigation.navigate("Shop_Order_Review_View", {
          order: orderWithTaxes,
        });
      } else {
        navigation.navigate("Long_Distance_Warning_View", {
          formatted_address,
          distance_in_miles,
          distance_time,
          coming_from,
          order: orderWithTaxes,
        });
      }
    } catch (e) {
      console.log("PICKUP TAX FLOW ERROR:", e?.message || e);
      // optionally show a toast/alert here
    } finally {
      setIsLoading(false);
    }

    return;
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
        ordersGrouped,
        gettingAllOrdersByUserIDGroupedByMonth,
        setDifferentAddress,
        differentAddress,
        handlingDeliveryOption,
        handlingPickupOption,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
