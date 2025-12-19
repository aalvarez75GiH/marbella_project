import { StyleSheet } from "react-native";
import { Navigation } from "./src/infrastructure/navigation";
import { ThemeProvider } from "styled-components/native";
import { useFonts } from "expo-font";

import { theme } from "./src/infrastructure/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    ralewayRegular: require("./assets/fonts/raleway/Raleway-Regular.ttf"),
    ralewayBold: require("./assets/fonts/raleway/Raleway-Bold.ttf"),
    dmSansRegular: require("./assets/fonts/dm sans/DMSans-Regular.ttf"),
    dmSansBold: require("./assets/fonts/dm sans/DMSans-Bold.ttf"),
    dmSansSemiBold: require("./assets/fonts/dm sans/DMSans-SemiBold.ttf"),
    cormorantRegular: require("./assets/fonts/cormorant/Cormorant-Regular.ttf"),
    cormorantBold: require("./assets/fonts/cormorant/Cormorant-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider theme={theme}>
      <Navigation />
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
