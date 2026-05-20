import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Shopping_Cart_View from "../../Views/cart_views/shopping_cart.view";
import Cart_Delivery_Type_View from "../../Views/cart_views/cart_delivery_type.view";
import Cart_Order_Review_View from "../../Views/cart_views/cart_order_review.view";
import Cart_Payment_View from "../../Views/cart_views/cart_payment.view";
import Cart_Order_Confirmation_View from "../../Views/cart_views/cart_order_confirmation.view";
import Cart_Order_Receipt_View from "../../Views/cart_views/cart_order_receipt.view";
import Cart_Different_Delivery_Address_View from "../../Views/cart_views/cart_different_delivery_address.view";
import Cart_Long_Distance_Warning_View from "../../Views/cart_views/cart_long_distance_warning.view";
import Menu_View from "../../Views/shop_views/menu.view";
import { CartContext } from "../services/cart/cart.context";

const CartStack = createNativeStackNavigator();

export const Cart_Navigator = () => {
  const { cartTotalItems } = useContext(CartContext);
  // console.log(
  //   "CART TOTAL ITEMS AT NAVIGATOR: ",
  //   JSON.stringify(cartTotalItems, null, 2)
  // );
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
        name="Cart_Delivery_Type_View"
        component={Cart_Delivery_Type_View}
      />
      <CartStack.Screen
        name="Cart_Order_Review_View"
        component={Cart_Order_Review_View}
      />
      {/* <CartStack.Screen
        name="Payment_customer_name_View"
        component={Shop_Order_Review_View}
      /> */}
      <CartStack.Screen
        name="Cart_Payment_View"
        component={Cart_Payment_View}
      />
      <CartStack.Screen
        name="Cart_Order_Confirmation_View"
        component={Cart_Order_Confirmation_View}
      />
      <CartStack.Screen
        name="Cart_Order_Receipt_View"
        component={Cart_Order_Receipt_View}
      />
      <CartStack.Screen
        name="Cart_Long_Distance_Warning_View"
        component={Cart_Long_Distance_Warning_View}
      />
      <CartStack.Screen
        name="Cart_Different_Delivery_Address_View"
        component={Cart_Different_Delivery_Address_View}
      />
      <CartStack.Screen name="Menu_View" component={Menu_View} />
    </CartStack.Navigator>
  );
};
