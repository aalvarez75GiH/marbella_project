import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Warehouses_View from "../../Views/warehouses/wareouses.view";
import Warehouse_Details_View from "../../Views/warehouses/warehouse_details.view";
import Warehouse_Inventory_View from "../../Views/warehouses/warehouse_inventory.view";

const WarehousesStack = createNativeStackNavigator();

export const Warehouses_Navigator = () => {
  return (
    <WarehousesStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <WarehousesStack.Screen
        name="Warehouses_admin_View"
        component={Warehouses_View}
      />
      <WarehousesStack.Screen
        name="Warehouse_Details_View"
        component={Warehouse_Details_View}
      />
      <WarehousesStack.Screen
        name="Warehouse_Inventory_View"
        component={Warehouse_Inventory_View}
      />
    </WarehousesStack.Navigator>
  );
};
