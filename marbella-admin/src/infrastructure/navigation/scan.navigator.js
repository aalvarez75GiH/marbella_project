import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Merchant_Pickup_Scanner_View from "../../Views/scan/order_scanner.view";
import Order_View from "../../Views/orders_views/order.view";
const ScanOrderStack = createNativeStackNavigator();

export const Scan_Order_Navigator = () => {
  return (
    <ScanOrderStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ScanOrderStack.Screen
        name="Merchant_Pickup_Scanner_View"
        component={Merchant_Pickup_Scanner_View}
      />
      <ScanOrderStack.Screen name="Order_View" component={Order_View} />
    </ScanOrderStack.Navigator>
  );
};
