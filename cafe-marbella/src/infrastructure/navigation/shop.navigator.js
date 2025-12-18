import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Shop_View from "../../Views/shop_views/shop.view";
import Shop_Product_Details_View from "../../Views/shop_views/shop_product_details.view";
import Shop_Shopping_Cart_View from "../../Views/shop_views/shop_shopping_cart";
const ShopFlowStack = createNativeStackNavigator();

export const Shop_Navigator = () => {
  return (
    <ShopFlowStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ShopFlowStack.Screen name="Home_View" component={Shop_View} />
      <ShopFlowStack.Screen
        name="Shop_Product_Details_View"
        component={Shop_Product_Details_View}
      />
      <ShopFlowStack.Screen
        name="Shop_Shopping_Cart_View"
        component={Shop_Shopping_Cart_View}
      />
    </ShopFlowStack.Navigator>
  );
};
