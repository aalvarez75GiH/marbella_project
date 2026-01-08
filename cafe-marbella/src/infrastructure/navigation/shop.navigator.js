import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Shop_View from "../../Views/shop_views/shop.view";
import Shop_Product_Details_View from "../../Views/shop_views/shop_product_details.view";
import Process_Shopping_Cart_View from "../../Views/shop_views/process_shopping_cart.view";
import Shop_Delivery_Type_View from "../../Views/shop_views/shop_delivery_type.view";
import Shop_Order_Review_View from "../../Views/shop_views/shop_order_review.view";
import Payment_Customer_Name_View from "../../Views/shop_views/payment_customer_name.view";
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
        component={Process_Shopping_Cart_View}
      />
      <ShopFlowStack.Screen
        name="Shop_Delivery_Type_View"
        component={Shop_Delivery_Type_View}
      />
      <ShopFlowStack.Screen
        name="Shop_Order_Review_View"
        component={Shop_Order_Review_View}
      />
      <ShopFlowStack.Screen
        name="Payment_Customer_Name_View"
        component={Payment_Customer_Name_View}
      />
    </ShopFlowStack.Navigator>
  );
};
