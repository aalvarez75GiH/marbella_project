import React from "react";
import QRCode from "react-native-qrcode-svg";
import { Container } from "../containers/general.containers";
import { theme } from "../../infrastructure/theme/index";
import { Spacer } from "../spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";

export const Order_Pickup_QR = ({ token, size = 220 }) => {
  const qrValue = `marbella://pickup/${token}`;

  return (
    <Container
      justify="center"
      align="flex-start"
      color={theme.colors.bg.elements_bg}
    >
      <Spacer position="left" size="large">
        <Text variant="dm_sans_bold_16">
          {" "}
          You can show this QR code at picku up
        </Text>
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        <QRCode
          value={qrValue}
          size={size}
          backgroundColor="white"
          color="black"
        />
      </Spacer>
    </Container>
  );
};
