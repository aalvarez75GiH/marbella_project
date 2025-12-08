import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Menu_View from "../../Views/menu_views/menu.view";

const MenuStack = createNativeStackNavigator();

export const Menu_Navigator = () => {
  return (
    <MenuStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MenuStack.Screen name="Home_View" component={Menu_View} />
    </MenuStack.Navigator>
  );
};
