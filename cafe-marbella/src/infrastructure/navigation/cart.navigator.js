import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Shopping_Cart_View from "../../Views/cart_views/shopping_cart.view";
import Empty_Shopping_Cart_View from "../../Views/cart_views/empty_shopping_cart.view";

import { CartContext } from "../services/cart/cart.context";

const CartStack = createNativeStackNavigator();

export const Cart_Navigator = () => {
  const { cartTotalItems } = React.useContext(CartContext);
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
        component={
          cartTotalItems > 0 ? Shopping_Cart_View : Empty_Shopping_Cart_View
        }
      />
    </CartStack.Navigator>
  );
};
