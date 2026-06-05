import React, { useContext, useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { RootNavigator } from "./root.navigator";
import { AppProviders } from "./app.providers.navigator";
import { navigationRef } from "./navigation_ref";
import { theme as appTheme } from "../../infrastructure/theme";
import { Marbella_Custom_Splash } from "../../components/others/marbella_custom_splash_screen";

import { AuthenticationContext } from "../services/authentication/authentication.context";
import { WarehouseContext } from "../services/warehouse/warehouse.context";

// const BootScreen = () => {
//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: appTheme.colors.bg.elements_bg,
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <ActivityIndicator size="large" />
//     </View>
//   );
// };
const NavigationInner = () => {
  const { profileReady } = useContext(AuthenticationContext);
  const { warehouseReady, myWarehouse } = useContext(WarehouseContext);
  const [minimumSplashFinished, setMinimumSplashFinished] = useState(false);
  const [hasBootstrapped, setHasBootstrapped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumSplashFinished(true);
    }, 9000); // 4 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (
      !hasBootstrapped &&
      profileReady &&
      warehouseReady &&
      !!myWarehouse &&
      minimumSplashFinished
    ) {
      setHasBootstrapped(true);
    }
  }, [
    profileReady,
    warehouseReady,
    myWarehouse,
    minimumSplashFinished,
    hasBootstrapped,
  ]);

  if (!hasBootstrapped) return <Marbella_Custom_Splash />;

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
