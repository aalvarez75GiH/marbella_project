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

import { Cart_Context_Provider } from "../services/cart/cart.context";
import { Geolocation_Context_Provider } from "../services/geolocation/geolocation.context";
import { Warehouse_Context_Provider } from "../services/warehouse/warehouse.context";
import { Authentication_Context_Provider } from "../services/authentication/authentication.context";

import { CartContext } from "../services/cart/cart.context";
const Tab = createBottomTabNavigator();

const tabBarListeners = ({ navigation, route }) => ({
  tabPress: () => navigation.navigate(route.name),
});

export const AppNavigator = () => {
  return (
    <Geolocation_Context_Provider>
      <Warehouse_Context_Provider>
        <Cart_Context_Provider>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: "#247F35",
              tabBarInactiveTintColor: "#000000",
              headerShown: false,
              tabBarBackground: undefined,
              tabBarStyle: Platform.select({
                ios: {
                  height: 90,
                  paddingTop: 14, // Increase height for larger icons
                  backgroundColor: "#FFFFFF", // Transparent background for blur effect
                },
                default: {
                  height: 100,
                  paddingTop: 14, // Increase height for larger icons
                  backgroundColor: "#FFFFFF", // Transparent background for blur effect
                },
              }),

              tabBarLabelStyle: {
                fontSize: 12, // Increase font size
                fontWeight: "bold", // Optional: Make it bold
                paddingTop: 5, // Adjust padding for better spacing
              },
            }}
          >
            <Tab.Screen
              name="Shop"
              component={Shop_Navigator}
              listeners={tabBarListeners}
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
              listeners={tabBarListeners}
              options={{
                //   title: globalLanguage === "EN" ? "Work" : "Trabajo",
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
                tabBarIcon: ({ color, size }) => {
                  // Access the cart context here
                  const { cartTotalItems } = useContext(CartContext);
                  return (
                    <Cart_Active_With_Items_CTA
                      size={size ?? 25}
                      quantity={cartTotalItems}
                      type={1}
                      color={theme.colors.bg.elements_bg}
                    />
                  );
                },
              }}
            />
          </Tab.Navigator>
        </Cart_Context_Provider>
      </Warehouse_Context_Provider>
    </Geolocation_Context_Provider>
  );
};
