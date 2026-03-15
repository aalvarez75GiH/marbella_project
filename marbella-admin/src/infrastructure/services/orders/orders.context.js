import React, { useEffect, useState, createContext, useContext } from "react";

import { myOrder_schema } from "./orders.local_data";
import {
  gettingAllOrdersByUserIDRequest,
  gettingAllOrdersByUserIDGroupedByMonthRequest,
  getOrderByPickupTokenRequest,
  updateOrderStatusRequest,
  getCustomersOrdersByTokenRequest,
} from "./orders.services";
import { AuthenticationContext } from "../authentication/authentication.context";

export const OrdersContext = createContext();

export const Orders_Context_Provider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [ordersGrouped, setOrdersGrouped] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myOrder, setMyOrder] = useState(myOrder_schema);
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [differentAddress, setDifferentAddress] = useState("");

  const { user } = useContext(AuthenticationContext);
  const user_id = user?.user_id;

  useEffect(() => {
    // Fetch orders when the component mounts or when user_id changes
    // const user_id = "aaa09d45-24a9-4a3f-aca5-9658952172c2"; // Replace with actual user ID from context/authentication
    if (user_id) {
      // gettingAllOrdersByUserID(user_id);
      gettingAllOrdersByUserIDGroupedByMonth(user_id);
    }
    if (!user_id) {
      setOrdersGrouped([]);
    }
  }, [user_id]);

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
    setIsOrdersLoading(true);
    // setTimeout(async () => {
    try {
      const fetchedOrdersGrouped =
        await gettingAllOrdersByUserIDGroupedByMonthRequest(user_id); // Replace with actual fetch logic
      // console.log(
      //   "Fetched Orders Grouped:",
      //   JSON.stringify(fetchedOrdersGrouped, null, 2)
      // );
      setOrdersGrouped(fetchedOrdersGrouped);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error);
    } finally {
      setIsOrdersLoading(false);
      // setIsLoading(false);
    }
    // }, 1000); // Simulate network delay
  };

  const handlingDeliveryOption = async ({
    navigation,
    onTaxes,
    differentAddress,
    customer_address,
  }) => {
    // console.log(
    //   "DIFFERENT ADDRESS AT HANDLING: ",
    //   JSON.stringify(differentAddress, null, 2)
    // );
    setIsCheckoutLoading(true);

    try {
      // 1) Prepare nextOrder with changes
      const nextOrder = {
        ...myOrder,
        order_products: myOrder.order_products, // ✅ force keep products
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
      setIsCheckoutLoading(false);
    }

    return;
  };
  const handlingPickupOption = async ({
    navigation,
    onTaxes,
    user_id,
    cart_id,
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
    warehouse_distance_range_positive,
    nextOrder,
  }) => {
    setIsCheckoutLoading(true);
    setDeliveryOption("pickup");

    try {
      const enrichedOrder = {
        ...nextOrder,
        user_id,
        cart_id,
        // order_products: products,
        order_products: nextOrder.order_products ?? products,
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
          order: orderWithTaxes,
        });
      }
    } catch (e) {
      console.log("PICKUP TAX FLOW ERROR:", e?.message || e);
      // optionally show a toast/alert here
    } finally {
      setIsCheckoutLoading(false);
    }

    return;
  };

  // orders.context.js
  const prepareOrderFromCart = (cart, user) => {
    console.log(
      "CART RECEIVED BY prepareOrderFromCart:",
      JSON.stringify(cart.products, null, 2)
    );
    const latestProducts = cart?.products ?? [];

    const nextOrder = {
      ...myOrder, // or your initialOrder template
      customer: {
        first_name: user?.first_name ?? "",
        last_name: user?.last_name ?? "",
        email: user?.email ?? "",
        phone_number: user?.phone_number ?? "",
        customer_address: user?.address ?? "",
        uid: user?.uid ?? "",
      },
      user_id: user?.user_id ?? "",
      cart_id: cart?.cart_id ?? "",
      order_status: "In Progress",
      order_products: latestProducts,
      pricing: {
        sub_total: Number(cart?.sub_total ?? 0),
        taxes: Number(cart?.taxes ?? 0),
        discount: 0,
        shipping: 0,
        total: Number(cart?.total ?? 0),
      },
      updatedAt: new Date().toISOString(),
    };

    setMyOrder(nextOrder);
    return nextOrder;
  };

  const resetOrdersContext = () => {
    setIsLoading(false);
    setMyOrder(myOrder_schema);
    setDeliveryOption(null);
    setDifferentAddress("");
  };

  // **************** ADMIN CONTEXT FUNCTIONS ****************

  const getOrderByQRToken = async (qr_token) => {
    try {
      const orderByQrTokenInfo = await getOrderByPickupTokenRequest(qr_token);
      console.log(
        "Order by QR Token :",
        JSON.stringify(orderByQrTokenInfo.order, null, 2)
      );
      console.log(
        "Order by QR Token response:",
        JSON.stringify(orderByQrTokenInfo.response, null, 2)
      );

      if (orderByQrTokenInfo?.response?.status === 409) {
        return orderByQrTokenInfo?.response;
      }
      if (orderByQrTokenInfo?.order) {
        return orderByQrTokenInfo.order;
      }
    } catch (error) {
      console.error("Error fetching order by QR token:", error);
    }
  };
  const getCustomersOrdersByQRToken = async (qr_token) => {
    try {
      const ordersByQrTokenInfo = await getCustomersOrdersByTokenRequest(
        qr_token
      );
      return ordersByQrTokenInfo;
      // console.log(
      //   "Order by QR Token :",
      //   JSON.stringify(ordersByQrTokenInfo.orders, null, 2)
      // );
      // console.log(
      //   "Order by QR Token response:",
      //   JSON.stringify(ordersByQrTokenInfo.response, null, 2)
      // );

      // if (ordersByQrTokenInfo?.response?.status === 409) {
      //   return ordersByQrTokenInfo?.response;
      // }
      // if (ordersByQrTokenInfo?.orders) {
      //   return ordersByQrTokenInfo.orders;
      // }
    } catch (error) {
      console.error("Error fetching order by QR token:", error);
    }
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const updateOrderStatus = async (order_id, order_status) => {
    setIsLoading(true);
    try {
      await wait(1000);

      const orderStatusUpdated = await updateOrderStatusRequest(
        order_id,
        order_status
      );

      console.log(
        "Order Status Updated :",
        JSON.stringify(orderStatusUpdated?.order, null, 2)
      );

      if (orderStatusUpdated?.order) {
        return orderStatusUpdated;
      }

      return null;
    } catch (error) {
      console.error("Error updating order status:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
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
        prepareOrderFromCart,
        resetOrdersContext,
        isOrdersLoading,
        isCheckoutLoading,
        getOrderByQRToken,
        updateOrderStatus,
        getCustomersOrdersByQRToken,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
