import React from "react";
import QRCode from "react-native-qrcode-svg";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Container } from "../../components/containers/general.containers";
import { theme } from "../../infrastructure/theme/index";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Just_Caption_Header } from "../../components/headers/just_caption.header";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";

export default function Customer_QR_View() {
  const route = useRoute();
  const navigation = useNavigation();
  const { customer_token, size } = route.params;
  //   const qrValue = `marbella://pickup/${token}`;
  const qrValue = `marbella://customer/${customer_token}`;

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Go_Back_Header action={() => navigation.goBack()} label="Your QR code" />

      <Container
        justify="center"
        align="center"
        color={theme.colors.bg.elements_bg}
      >
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        <QRCode
          value={qrValue}
          size={size}
          backgroundColor="white"
          color="black"
        />
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        <Text variant="dm_sans_bold_16"> Show this QR code at merchant</Text>
        <Text variant="dm_sans_bold_16">
          {" "}
          so they can get your orders, payments
        </Text>
        <Text variant="dm_sans_bold_16">and other info to make your</Text>
        <Text variant="dm_sans_bold_16">experience nicer!</Text>
      </Container>
    </SafeArea>
  );
}
