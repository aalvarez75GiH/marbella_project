import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Shopping_Cart_View from "../../Views/cart_views/shopping_cart.view";
import Empty_Shopping_Cart_View from "../../Views/cart_views/empty_shopping_cart.view";
import Shop_Delivery_Type_View from "../../Views/shop_views/shop_delivery_type.view";
import Shop_Order_Review_View from "../../Views/shop_views/shop_order_review.view";
import Payment_View from "../../Views/shop_views/payment.view";
import Order_Confirmation_View from "../../Views/shop_views/order_confirmation.view";
import Shop_Order_Receipt_View from "../../Views/shop_views/order_receipt.view";
import Long_Distance_Warning_View from "../../Views/shop_views/long_distance_warning.view";

import { CartContext } from "../services/cart/cart.context";

const CartStack = createNativeStackNavigator();

export const Cart_Navigator = () => {
  const { cartTotalItems } = useContext(CartContext);
  console.log(
    "CART TOTAL ITEMS AT NAVIGATOR: ",
    JSON.stringify(cartTotalItems, null, 2)
  );
  return (
    <CartStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CartStack.Screen
        name="Shopping_Cart_View"
        component={Shopping_Cart_View}
      />

      <CartStack.Screen
        name="Shop_Delivery_Type_View"
        component={Shop_Delivery_Type_View}
      />
      <CartStack.Screen
        name="Shop_Order_Review_View"
        component={Shop_Order_Review_View}
      />
      <CartStack.Screen
        name="Payment_customer_name_View"
        component={Shop_Order_Review_View}
      />
      <CartStack.Screen name="Payment_View" component={Payment_View} />
      <CartStack.Screen
        name="Order_Confirmation_View"
        component={Order_Confirmation_View}
      />
      <CartStack.Screen
        name="Shop_Order_Receipt_View"
        component={Shop_Order_Receipt_View}
      />
      <CartStack.Screen
        name="Long_Distance_Warning_View"
        component={Long_Distance_Warning_View}
      />
    </CartStack.Navigator>
  );
};
