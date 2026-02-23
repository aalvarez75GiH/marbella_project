import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { DefaultTheme } from "@react-navigation/native";

import { AuthenticationContext } from "../services/authentication/authentication.context";
import { RootNavigator } from "./root.navigator";
import { AppProviders } from "./app.providers.navigator";
import { navigationRef } from "./navigation_ref";
import { theme as appTheme } from "../../infrastructure/theme";

export const Navigation = () => {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: appTheme.colors.bg.elements_bg, // <- the color you want instead of grey
    },
  };
  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <AppProviders>
        <RootNavigator />
      </AppProviders>
    </NavigationContainer>
  );
};
