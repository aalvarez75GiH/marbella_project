import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Orders_View from "../../Views/orders_views/orders.view";
import { OrdersContext } from "../services/orders/orders.context";
import Empty_My_Orders_View from "../../Views/orders_views/empty_my_orders.view";

const OrdersStack = createNativeStackNavigator();

export const Orders_Navigator = () => {
  const { orders } = useContext(OrdersContext);
  return (
    <OrdersStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <OrdersStack.Screen
        name="Home_View"
        component={orders.length > 0 ? Orders_View : Empty_My_Orders_View}
      />
    </OrdersStack.Navigator>
  );
};
