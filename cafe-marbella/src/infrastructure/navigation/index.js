import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { AuthenticationContext } from "../services/authentication/authentication.context";
import { RootNavigator } from "./root.navigator";
import { AppProviders } from "./app.providers.navigator";
import { navigationRef } from "./navigation_ref";

export const Navigation = () => {
  const { user } = useContext(AuthenticationContext);

  return (
    <NavigationContainer ref={navigationRef}>
      <AppProviders>
        <RootNavigator />
      </AppProviders>
    </NavigationContainer>
  );
};
