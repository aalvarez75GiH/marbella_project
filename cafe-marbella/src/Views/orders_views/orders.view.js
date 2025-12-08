import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "styled-components/native";
import { fonts, fontWeights } from "../../infrastructure/theme/fonts";
import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";

export default function Orders_View() {
  const theme = useTheme();
  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      <Container
        width="100%"
        height="900px"
        // color={theme.colors.bg.screens_bg}
        color={"green"}
        justify="flex-start"
        align="center"
      >
        <Exit_Header_With_Label action={() => null} label="My Orders" />
      </Container>
    </SafeArea>
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
