import { StyleSheet } from "react-native";
import { Navigation } from "./src/infrastructure/navigation";
import { ThemeProvider } from "styled-components/native";
import { useFonts } from "expo-font";

import { Authentication_Context_Provider } from "./src/infrastructure/services/authentication/authentication.context";
import { theme } from "./src/infrastructure/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    ralewayRegular: require("./assets/fonts/raleway/Raleway-Regular.ttf"),
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
      <Authentication_Context_Provider>
        <Navigation />
      </Authentication_Context_Provider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
