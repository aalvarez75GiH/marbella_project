import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppNavigator } from "./app.navigator";
import { Auth_Navigator } from "./auth.navigator";

const RootStack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Your current app (tabs + stacks) */}
      <RootStack.Screen name="App" component={AppNavigator} />

      {/* Auth flow as a modal */}
      <RootStack.Screen
        name="Auth_Navigator"
        component={Auth_Navigator}
        options={{
          presentation: "card",
          animation: "slide_from_right",
        }}
      />
    </RootStack.Navigator>
  );
};
