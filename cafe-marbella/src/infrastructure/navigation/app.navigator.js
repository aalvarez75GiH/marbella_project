import React from "react";
import { Platform } from "react-native";
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Shop_Navigator } from "./shop.navigator";
import { Orders_Navigator } from "./orders.navigator";
import { Menu_Navigator } from "./menu.navigator";

import ShopIcon from "../../../assets/my_icons/shop_icon.svg";
import OrdersIcon from "../../../assets/my_icons/receipt_orders.svg";
import MenuIcon from "../../../assets/my_icons/two_lines_menu_icon.svg";

const Tab = createBottomTabNavigator();

const tabBarListeners = ({ navigation, route }) => ({
  tabPress: () => navigation.navigate(route.name),
});

// const getActiveRouteName = (route) => {
//   if (!route) return undefined;
//   // Try the helper first
//   const focused = getFocusedRouteNameFromRoute(route);
//   if (focused) return focused;

//   // Fallback: walk nested state (works on RN v6)
//   let r = route;
//   while (r && r.state && r.state.routes && r.state.index != null) {
//     r = r.state.routes[r.state.index];
//   }
//   return r?.name;
// };

// const ConditionalTabBar = (props) => {
//   const currentTabRoute = props.state.routes[props.state.index];
//   const nestedName = getActiveRouteName(currentTabRoute);

//   const BottomBar =
//     (currentTabRoute.name === "Home" &&
//       nestedName === "Clips_by_Status_View_1") ||
//     nestedName === "Clips_by_Status_View_2" ||
//     nestedName === "Clips_by_Status_View_3" ||
//     nestedName === "Quickies_Text_Clips_View";

//   if (BottomBar) {
//     // render your custom bar instead of the default one
//     return <Status_Next_Step_Bottom_Bar />;
//   }

//   return <BottomTabBar {...props} />;
// };

let currentColor = "#CAD";

export const AppNavigator = () => {
  //   const { globalLanguage } = React.useContext(GlobalContext);
  return (
    <Tab.Navigator
      //   tabBar={(props) => <ConditionalTabBar {...props} />}
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
          //   title: globalLanguage === "EN" ? "Work" : "Trabajo",
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
        name="Menu"
        component={Menu_Navigator}
        listeners={tabBarListeners}
        options={{
          //   title: globalLanguage === "EN" ? "Work" : "Trabajo",
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <MenuIcon width={25} height={25} fill={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
