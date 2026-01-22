import React, { useContext } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Text } from "../../infrastructure/typography/text.component";
import { DataInput } from "../../components/inputs/data_text_input";
import { Regular_CTA } from "../../components/ctas/regular.cta";

import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";
export default function Different_Delivery_Address_View() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { onTaxes } = useContext(PaymentsContext);
  const {
    differentAddress,
    setDifferentAddress,
    handlingDeliveryOption,
    myOrder,
  } = useContext(OrdersContext);
  const { customer_address } = myOrder || {};
  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.screens_bg}
        // color={"green"}
        justify="flex-start"
        align="center"
      >
        <Exit_Header_With_Label
          label="Delivery Address"
          action={() => navigation.goBack()}
        />
        <Container
          width="100%"
          height="15%"
          color="red"
          justify="center"
          align="flex-start"
        >
          <Spacer position="left" size="large">
            <Text variant="raleway_bold_18">Enter a different address:</Text>
          </Spacer>
        </Container>
        <Container
          width="100%"
          height="15%"
          color="red"
          justify="center"
          align="center"
        >
          <DataInput
            label="New address for delivery"
            // onChangeText={(value) => setNameOnCard(value)}
            onChangeText={(value) => setDifferentAddress(value)}
            value={differentAddress}
            underlineColor={theme.colors.inputs.bottom_lines}
            activeUnderlineColor={"#3A2F01"}
          />
        </Container>
        <Container
          width="100%"
          height="15%"
          color="red"
          justify="center"
          align="center"
        >
          <Regular_CTA
            width="95%"
            height="70%"
            color={theme.colors.brand.primary}
            border_radius={"40px"}
            caption="Continue"
            caption_text_variant="dm_sans_bold_20_white"
            action={async () => {
              await handlingDeliveryOption({
                navigation,
                onTaxes,
                differentAddress,
                customer_address,
              });
            }}
          />
        </Container>
        <Spacer position="top" size="large" />
      </Container>
    </SafeArea>
  );
}
