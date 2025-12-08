import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Orders_View from "../../Views/orders_views/orders.view";

const OrdersStack = createNativeStackNavigator();

export const Orders_Navigator = () => {
  return (
    <OrdersStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <OrdersStack.Screen name="Home_View" component={Orders_View} />
    </OrdersStack.Navigator>
  );
};
