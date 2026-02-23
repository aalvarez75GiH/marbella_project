import React, { useContext } from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

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
  ios: { height: 90, paddingTop: 14, backgroundColor: "#FFFFFF" },
  default: { height: 100, paddingTop: 14, backgroundColor: "#FFFFFF" },
});

// smoother than display:none
// const HIDDEN_TAB_STYLE = {
//   ...TAB_BAR_BASE_STYLE,
//   opacity: 0,
//   pointerEvents: "none",
// };
const HIDDEN_TAB_STYLE = {
  ...TAB_BAR_BASE_STYLE,
  backgroundColor: "transparent",
  borderTopWidth: 0,
  elevation: 0, // Android shadow
  shadowOpacity: 0, // iOS shadow
  opacity: 0,
  pointerEvents: "none",
};

const HIDE_TAB_ROUTES = new Set([
  "Menu_View",
  "Shop_Shopping_Cart_View",
  "Shop_Order_Review_View",
  "Payment_View",
  "Shop_Order_Receipt_View",
  "Shop_Delivery_Type_View",
  "Order_Confirmation_View",
]);

function tabBarStyleFromNested(route, fallback) {
  const nested = getFocusedRouteNameFromRoute(route) ?? fallback;
  const shouldHide = HIDE_TAB_ROUTES.has(nested);
  // 🔥 debug
  console.log("Shop tab nested:", nested, "hide:", shouldHide);
  return shouldHide ? HIDDEN_TAB_STYLE : TAB_BAR_BASE_STYLE;
}

const Tabs = () => {
  const { cartTotalItems } = useContext(CartContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: TAB_BAR_BASE_STYLE,
        tabBarBackground: () => null,
        headerShown: false,

        // 🔥 ADD THIS
        sceneContainerStyle: {
          backgroundColor: "transparent",
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
        options={({ route }) => ({
          title: "Shop",
          tabBarStyle: tabBarStyleFromNested(route, "Home_View"),
          tabBarIcon: ({ color }) => (
            <ShopIcon width={25} height={25} fill={color} />
          ),
        })}
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
          tabBarIcon: ({ size }) => (
            <Cart_Active_With_Items_CTA
              size={size ?? 25}
              quantity={cartTotalItems}
              type={1}
              color={theme.colors.bg.elements_bg}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => <Tabs />;
