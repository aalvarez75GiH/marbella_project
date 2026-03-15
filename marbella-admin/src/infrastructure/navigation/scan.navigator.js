import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Merchant_Pickup_Scanner_View from "../../Views/scan/order_scanner.view";
import Order_View from "../../Views/orders_views/order.view";
import Orders_Admin_View from "../../Views/scan/orders_admin.view";
import Customers_QR_Scanner_View from "../../Views/scan/customer_scanner.view";

const ScanOrderStack = createNativeStackNavigator();

export const Scan_Order_Navigator = () => {
  return (
    <ScanOrderStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ScanOrderStack.Screen
        name="Orders_Admin_View"
        component={Orders_Admin_View}
      />
      <ScanOrderStack.Screen
        name="Merchant_Pickup_Scanner_View"
        component={Merchant_Pickup_Scanner_View}
      />
      <ScanOrderStack.Screen
        name="Customers_QR_Scanner_View"
        component={Customers_QR_Scanner_View}
      />
      <ScanOrderStack.Screen name="Order_View" component={Order_View} />
    </ScanOrderStack.Navigator>
  );
};
