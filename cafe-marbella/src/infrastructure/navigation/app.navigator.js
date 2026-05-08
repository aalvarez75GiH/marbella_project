import React, { useContext } from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Shop_Navigator } from "./shop.navigator";
import { Orders_Navigator } from "./orders.navigator";
import { Cart_Navigator } from "./cart.navigator";

import ShopIcon from "../../../assets/my_icons/shop_icon.svg";
import OrdersIcon from "../../../assets/my_icons/receipt_orders.svg";
import { Cart_Active_With_Items_CTA } from "../../components/ctas/my_cart_active_items.cta";
import { theme } from "../theme";
import { CartContext } from "../services/cart/cart.context";

const Tab = createBottomTabNavigator();

const TAB_BAR_BASE_STYLE = Platform.select({
  ios: {
    position: "absolute",
    height: 90,
    paddingTop: 14,
    backgroundColor: "#FFFFFF",
  },
  default: {
    position: "absolute",
    height: 100,
    paddingTop: 14,
    backgroundColor: "#FFFFFF",
  },
});

const HIDE_TAB_ROUTES = new Set([
  "Menu_View",
  "Shop_Shopping_Cart_View",
  "Shop_Delivery_Type_View",
  "Shop_Order_Review_View",
  "Payment_View",
  "Order_Confirmation_View",
  "Shop_Order_Receipt_View",
]);

const Tabs = () => {
  const { cartTotalItems } = useContext(CartContext);

  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={{
        tabBarStyle: TAB_BAR_BASE_STYLE,
        tabBarBackground: () => null,
        headerShown: false,

        sceneContainerStyle: {
          backgroundColor: theme.colors.bg.elements_bg,
        },

        tabBarActiveTintColor: "#247F35",
        tabBarInactiveTintColor: "#000000",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Shop"
        component={Shop_Navigator}
        options={{
          title: "Shop",
          tabBarIcon: ({ color }) => (
            <ShopIcon width={25} height={25} fill={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Orders"
        component={Orders_Navigator}
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <OrdersIcon width={25} height={25} fill={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={Cart_Navigator}
        options={{
          title: "Cart",
          tabBarIcon: ({ size, color }) => (
            <Cart_Active_With_Items_CTA
              size={size ?? 25}
              quantity={cartTotalItems}
              type={1}
              color={theme.colors.bg.elements_bg}
              active_color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => <Tabs />;
