import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Orders_View from "../../Views/orders_views/orders.view";
import Order_View from "../../Views/orders_views/order.view";
import Order_Pickup_QR_View from "../../Views/orders_views/order_pickup_qr.view";

const OrdersStack = createNativeStackNavigator();

export const Orders_Navigator = () => {
  return (
    <OrdersStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <OrdersStack.Screen name="Orders_View" component={Orders_View} />
      <OrdersStack.Screen name="Order_View" component={Order_View} />
      <OrdersStack.Screen
        name="Order_Pickup_QR_View"
        component={Order_Pickup_QR_View}
      />
    </OrdersStack.Navigator>
  );
};
