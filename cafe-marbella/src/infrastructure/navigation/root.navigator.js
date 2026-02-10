import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppNavigator } from "./app.navigator";
import { Auth_Navigator } from "./auth.navigator";

const RootStack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="App" component={AppNavigator} />

      <RootStack.Screen
        name="AuthModal"
        component={Auth_Navigator}
        options={{ presentation: "modal" }}
      />
    </RootStack.Navigator>
  );
};
