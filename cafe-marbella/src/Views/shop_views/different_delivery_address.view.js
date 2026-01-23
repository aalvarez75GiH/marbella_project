import React, { useContext } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Platform, KeyboardAvoidingView, ScrollView, View } from "react-native";

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
  console.log(
    "MY ORDER AT DIFFERENT DELIVERY ADDRESS VIEW:",
    JSON.stringify(myOrder, null, 2)
  );
  const { customer_address } = myOrder || {};
  const CTA_HEIGHT = 65; // ✅ fixed height so it never shrinks
  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          justify="flex-start"
          align="center"
        >
          <Exit_Header_With_Label
            label="Delivery Address"
            action={() => navigation.goBack()}
          />

          {/* ✅ Scrollable content */}
          <ScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: 44, // ✅ space from header
              paddingBottom: 16,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <Container
              width="100%"
              //   color="green"
              color={theme.colors.bg.elements_bg}
              justify="flex-start" // ✅
              align="flex-start"
              style={{ paddingVertical: 12 }}
            >
              <Spacer position="left" size="large">
                <Text variant="raleway_bold_20">
                  Do you want to enter a new delivery address?
                </Text>
                <Spacer position="top" size="medium" />
                <Text variant="raleway_medium_18">Go ahead!</Text>
              </Spacer>
            </Container>

            {/* ✅ SPACE BETWEEN BLOCKS */}
            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />

            <Container
              width="100%"
              //   color="red"
              color={theme.colors.bg.elements_bg}
              justify="flex-start" // ✅
              align="center"
              style={{ paddingVertical: 10 }}
            >
              <DataInput
                label="New address for delivery"
                onChangeText={(value) => setDifferentAddress(value)}
                value={differentAddress}
                underlineColor={theme.colors.inputs.bottom_lines}
                activeUnderlineColor={"#3A2F01"}
              />
            </Container>

            {/* filler pushes CTA down */}
            <View style={{ flex: 1 }} />
          </ScrollView>

          {/* ✅ Fixed footer CTA (outside ScrollView) */}
          <Container
            width="100%"
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="center"
            style={{
              paddingBottom: 16,
              paddingTop: 8,
              // optional: subtle separation
              // borderTopWidth: 1,
              // borderTopColor: "#00000010",
            }}
          >
            <Regular_CTA
              width="95%"
              height={CTA_HEIGHT} // ✅ FIXED height (number)
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
        </Container>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
