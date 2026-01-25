import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Shop_View from "../../Views/shop_views/shop.view";
import Shop_Product_Details_View from "../../Views/shop_views/shop_product_details.view";
import Process_Shopping_Cart_View from "../../Views/shop_views/process_shopping_cart.view";
import Shop_Delivery_Type_View from "../../Views/shop_views/shop_delivery_type.view";
import Shop_Order_Review_View from "../../Views/shop_views/shop_order_review.view";
import Payment_View from "../../Views/shop_views/payment.view";
import Order_Confirmation_View from "../../Views/shop_views/order_confirmation.view";
import Shop_Order_Receipt_View from "../../Views/shop_views/order_receipt.view";
import Long_Distance_Warning_View from "../../Views/shop_views/long_distance_warning.view";
import Menu_View from "../../Views/shop_views/menu.view";
import Different_Delivery_Address_View from "../../Views/shop_views/different_delivery_address.view";
import Product_Specifications_View from "../../Views/shop_views/product_specifications.view";

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
      <ShopFlowStack.Screen name="Payment_View" component={Payment_View} />
      <ShopFlowStack.Screen
        name="Order_Confirmation_View"
        component={Order_Confirmation_View}
      />
      <ShopFlowStack.Screen
        name="Shop_Order_Receipt_View"
        component={Shop_Order_Receipt_View}
      />
      <ShopFlowStack.Screen
        name="Long_Distance_Warning_View"
        component={Long_Distance_Warning_View}
      />
      <ShopFlowStack.Screen
        name="Different_Delivery_Address_View"
        component={Different_Delivery_Address_View}
      />
      <ShopFlowStack.Screen
        name="Product_Specifications_View"
        component={Product_Specifications_View}
      />
      <ShopFlowStack.Screen name="Menu_View" component={Menu_View} />
    </ShopFlowStack.Navigator>
  );
};
