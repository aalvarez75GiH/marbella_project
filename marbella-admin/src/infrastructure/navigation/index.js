import React, { useContext, useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { AuthenticationContext } from "../services/authentication/authentication.context";
import { RootNavigator } from "./root.navigator";
import { AppProviders } from "./app.providers.navigator";
import { navigationRef } from "./navigation_ref";
import { theme as appTheme } from "../../infrastructure/theme";

const BootScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: appTheme.colors.bg.elements_bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
};

const NavigationInner = () => {
  console.log("NAV: profileReady =", profileReady);
  const { profileReady } = useContext(AuthenticationContext);

  // ✅ hard gate: nothing under RootNavigator runs until user vs guest decided
  // if (!profileReady) return <BootScreen />;
  const [hasBootstrapped, setHasBootstrapped] = useState(false);
  useEffect(() => {
    if (profileReady && !hasBootstrapped) {
      setHasBootstrapped(true);
    }
  }, [profileReady, hasBootstrapped]);
  console.log("NAV: profileReady =", profileReady);
  console.log("NAV: hasBootstrapped =", hasBootstrapped);
  // ✅ only block the VERY FIRST app boot
  if (!hasBootstrapped) return <BootScreen />;

  return <RootNavigator />;
};

export const Navigation = () => {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: appTheme.colors.bg.elements_bg,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <AppProviders>
        <NavigationInner />
      </AppProviders>
    </NavigationContainer>
  );
};
