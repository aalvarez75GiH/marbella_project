import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Warehouses_View from "../../Views/warehouses/wareouses.view";
import Warehouse_Details_View from "../../Views/warehouses/warehouse_details.view";
import Warehouse_Inventory_View from "../../Views/warehouses/warehouse_inventory.view";
import Warehouse_Representative_View from "../../Views/warehouses/warehouse_representative.view";
import Products_By_grindType_View from "../../Views/warehouses/warehouses_products_by_grindType.view";
import Products_By_Roast_View from "../../Views/warehouses/products_by_roast.view";
import Products_View from "../../Views/warehouses/products.view";

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

      <WarehousesStack.Screen
        name="Warehouse_Representative_View"
        component={Warehouse_Representative_View}
      />
      <WarehousesStack.Screen
        name="Products_By_grindType_View"
        component={Products_By_grindType_View}
      />
      <WarehousesStack.Screen
        name="Products_By_Roast_View"
        component={Products_By_Roast_View}
      />
      <WarehousesStack.Screen name="Products_View" component={Products_View} />
    </WarehousesStack.Navigator>
  );
};
