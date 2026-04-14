import React, { useContext, useEffect, useState, useRef } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { DataInput } from "../../components/inputs/data_text_input.js";

import { GlobalContext } from "../../infrastructure/services/global/global.context.js";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context.js";

export default function Warehouse_Representative_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { warehouseSelected, setWarehouseSelected } =
    useContext(WarehouseContext);
  const [isRepresentativeNameFocused, setRepresentativeNameFocused] =
    useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const [error, setError] = useState(null);

  const representativeNameInputRef = useRef(null);
  const emailDataInputRef = useRef(null);
  const phoneDataInputRef = useRef(null);

  const { formatPhone } = useContext(GlobalContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      representativeNameInputRef.current?.focus();
    }, 100); // small delay helps with navigation transitions

    return () => clearTimeout(timer);
  }, []);

  console.log(
    "WAREHOUSE SELECTED AT REP VIEW:",
    JSON.stringify(warehouseSelected, null, 2)
  );

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          justify="flex-start"
          align="center"
        >
          <Go_Back_Header label="" action={() => navigation.goBack()} />

          <ScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{
              paddingBottom: 40,
              alignItems: "center",
            }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            scrollEnabled={scrollEnabled}
          >
            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />
            <Container
              width="100%"
              color={theme.colors.bg.elements_bg}
              align="flex-start"
            >
              <Spacer position="left" size="extraLarge">
                <Text variant="raleway_bold_18" textAlign="center">
                  Warehouse information
                </Text>
              </Spacer>
            </Container>

            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />

            <Container
              width="100%"
              color={theme.colors.bg.elements_bg}
              align="center"
              justify="flex-start"
              direction="column"
              style={{ overflow: "visible" }}
            >
              <DataInput
                ref={representativeNameInputRef}
                label="Representative name"
                value={
                  warehouseSelected.warehouse_information.representative.name
                }
                onChangeText={(value) => {
                  setWarehouseSelected({
                    ...warehouseSelected,
                    warehouse_information: {
                      ...warehouseSelected.warehouse_information,
                      representative: {
                        ...warehouseSelected.warehouse_information
                          .representative,
                        name: value,
                      },
                    },
                  });
                }}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.3px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType="default"
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="givenName"
                autoComplete="name"
                returnKeyType="done"
                blurOnSubmit
                style={{
                  backgroundColor: "#F5F5F5",
                  fontSize: 16,
                }}
                contentStyle={{
                  fontFamily: "ralewayBold",
                  fontSize: 16,
                }}
              />

              <Spacer position="top" size="large" />

              <DataInput
                ref={emailDataInputRef}
                label="Representative Email"
                value={
                  warehouseSelected.warehouse_information.representative.email
                }
                onChangeText={(value) => {
                  setWarehouseSelected({
                    ...warehouseSelected,
                    warehouse_information: {
                      ...warehouseSelected.warehouse_information,
                      representative: {
                        ...warehouseSelected.warehouse_information
                          .representative,
                        email: value,
                      },
                    },
                  });
                }}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.3px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="email"
                autoComplete="email"
                returnKeyType="done"
                blurOnSubmit
                style={{
                  backgroundColor: "#F5F5F5",
                  fontSize: 16,
                }}
                contentStyle={{
                  fontFamily: "ralewayBold",
                  fontSize: 16,
                }}
              />
              <Spacer position="top" size="medium" />
              <DataInput
                ref={phoneDataInputRef}
                label="Representative Phone number"
                value={
                  warehouseSelected.warehouse_information.representative
                    .phone_number
                }
                onChangeText={(value) => {
                  const formatted = formatPhone(value);
                  setWarehouseSelected({
                    ...warehouseSelected,
                    warehouse_information: {
                      ...warehouseSelected.warehouse_information,
                      representative: {
                        ...warehouseSelected.warehouse_information
                          .representative,
                        phone_number: formatted,
                      },
                    },
                  });
                }}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.3px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType={
                  Platform.OS === "ios" ? "number-pad" : "phone-pad"
                }
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="telephoneNumber"
                autoComplete="tel"
                returnKeyType="done"
                blurOnSubmit
                style={{
                  backgroundColor: "#F5F5F5",
                  fontSize: 16,
                }}
                contentStyle={{
                  fontFamily: "ralewayBold",
                  fontSize: 16,
                }}
              />
              <Spacer position="top" size="medium" />
            </Container>
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
