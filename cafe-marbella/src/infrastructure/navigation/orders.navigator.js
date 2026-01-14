import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Orders_View from "../../Views/orders_views/orders.view";
import { OrdersContext } from "../services/orders/orders.context";
import Empty_My_Orders_View from "../../Views/orders_views/empty_my_orders.view";
import Shop_Order_Receipt_View from "../../Views/shop_views/order_receipt.view";
import Order_View from "../../Views/orders_views/order.view";
const OrdersStack = createNativeStackNavigator();

export const Orders_Navigator = () => {
  const { orders } = useContext(OrdersContext);
  return (
    <OrdersStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <OrdersStack.Screen name="Orders_View" component={Orders_View} />
      <OrdersStack.Screen name="Order_View" component={Order_View} />
    </OrdersStack.Navigator>
  );
};
