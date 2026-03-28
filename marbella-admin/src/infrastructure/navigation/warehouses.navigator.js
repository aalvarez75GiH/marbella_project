import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Warehouses_View from "../../Views/warehouses/wareouses.view";

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
    </WarehousesStack.Navigator>
  );
};
