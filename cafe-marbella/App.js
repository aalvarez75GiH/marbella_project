import { Navigation } from "./src/infrastructure/navigation";
import { ThemeProvider } from "styled-components/native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Authentication_Context_Provider } from "./src/infrastructure/services/authentication/authentication.context";
import { Geolocation_Context_Provider } from "./src/infrastructure/services/geolocation/geolocation.context";
import { AppProviders } from "./src/infrastructure/navigation/app.providers.navigator";
import { theme } from "./src/infrastructure/theme";

export default function App() {
  // useEffect(() => {
  //   AsyncStorage.clear().then(() => {
  //     console.log("🧹 AsyncStorage cleared (dev reset)");
  //   });
  // }, []);

  useEffect(() => {
    const logAsyncStorageKeys = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        console.log("📦 AsyncStorage KEYS:", JSON.stringify(keys, null, 2));
        const entries = await AsyncStorage.multiGet(keys);
        entries.forEach(([key, value]) => {
          console.log(`🧩 ${key}:`, JSON.stringify(value, null, 2));
        });
      } catch (e) {
        console.log("❌ Error reading AsyncStorage keys:", e);
      }
    };

    logAsyncStorageKeys();
  }, []);
  const [fontsLoaded] = useFonts({
    ralewayRegular: require("./assets/fonts/raleway/Raleway-Regular.ttf"),
    ralewayMedium: require("./assets/fonts/raleway/Raleway-Medium.ttf"),
    ralewayBold: require("./assets/fonts/raleway/Raleway-Bold.ttf"),
    dmSansRegular: require("./assets/fonts/dm sans/DMSans-Regular.ttf"),
    dmSansBold: require("./assets/fonts/dm sans/DMSans-Bold.ttf"),
    dmSansSemiBold: require("./assets/fonts/dm sans/DMSans-SemiBold.ttf"),
    cormorantRegular: require("./assets/fonts/cormorant/Cormorant-Regular.ttf"),
    cormorantSemiBoldItalic: require("./assets/fonts/cormorant/Cormorant-SemiBoldItalic.ttf"),
    cormorantBold: require("./assets/fonts/cormorant/Cormorant-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider theme={theme}>
      <Geolocation_Context_Provider>
        <Authentication_Context_Provider>
          <Navigation />
        </Authentication_Context_Provider>
      </Geolocation_Context_Provider>
    </ThemeProvider>
  );
}
