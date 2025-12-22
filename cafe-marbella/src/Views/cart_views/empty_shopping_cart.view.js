import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import { useTheme } from "styled-components/native";
import { fonts, fontWeights } from "../../infrastructure/theme/fonts";
import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import CleaningIcon from "../../../assets/my_icons/CleaningIcon.svg";
import { Text } from "../../infrastructure/typography/text.component";
import { Just_Caption_Header } from "../../components/headers/just_caption.header";

export default function Empty_Shopping_Cart_View() {
  const theme = useTheme();
  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.screens_bg}
        //color={"green"}
        justify="flex-start"
        align="center"
      >
        <Just_Caption_Header caption="My Cart" />

        <Spacer position="top" size="small" />
        <Container
          width="100%"
          height="90%"
          color={theme.colors.bg.elements_bg}
          //   color={"red"}
          justify="center"
          align="center"
        >
          <CleaningIcon width={150} height={150} />
          <Spacer position="top" size="large" />
          <Text variant="raleway_bold_20">Your shopping cart is empty</Text>

          <Text variant="raleway_bold_20">Come on! Fill it up</Text>
        </Container>
      </Container>
    </SafeArea>
  );
}
