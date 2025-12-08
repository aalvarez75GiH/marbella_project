import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Shop_View from "../../Views/shop_views/shop.view";

const ShopFlowStack = createNativeStackNavigator();

export const Shop_Navigator = () => {
  return (
    <ShopFlowStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ShopFlowStack.Screen name="Home_View" component={Shop_View} />
    </ShopFlowStack.Navigator>
  );
};
