import React, { useContext, useEffect, useState, useRef } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";

import { GlobalContext } from "../../infrastructure/services/global/global.context.js";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context.js";

export default function Admin_Enter_Email_View() {
  const navigation = useNavigation();

  const { isValidEmail } = useContext(GlobalContext);
  const { getCustomersOrdersByEmail } = useContext(OrdersContext);

  const theme = useTheme();

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [userEmail, setUserEmail] = useState(""); // local state for email input

  const route = useRoute();

  const emailDataInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      emailDataInputRef.current?.focus();
    }, 100); // small delay helps with navigation transitions

    return () => clearTimeout(timer);
  }, []);

  console.log(
    "USER TO DB IN ENTER EMAIL VIEW:",
    JSON.stringify(userEmail, null, 2)
  );
  console.log("EMAIL FOCUSED:", JSON.stringify(isEmailFocused, null, 2));
  console.log(
    "USER TO DB IN ENTER EMAIL VIEW:",
    JSON.stringify(userEmail, null, 2)
  );
  console.log(
    "IS VALID EMAIL:",
    JSON.stringify(isValidEmail(userEmail), null, 2)
  );

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? undefined : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // tweak if needed
      >
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          //color={"red"}
          justify="flex-start"
          align="center"
        >
          <Go_Back_Header
            label=""
            action={() => {
              setUserToDB({
                ...userToDB,
                email: "",
              });
              setIsEmailFocused(true);
              navigation.goBack();
            }}
          />

          <Container
            width="100%"
            height="10%"
            color={theme.colors.bg.elements_bg}
            //   color={"yellow"}
            align="flex-start"
          >
            <Spacer position="left" size="extraLarge">
              <Text variant="raleway_bold_18" textAlign="center">
                Enter your email
              </Text>
            </Spacer>
          </Container>
          <Container
            width="100%"
            height="20%"
            color={theme.colors.bg.elements_bg}
            //   color={"yellow"}
            align="center"
            direction="column"
          >
            <DataInput
              ref={emailDataInputRef}
              label="Email"
              value={userEmail}
              onChangeText={(value) => {
                setUserEmail(value); // update local state

                if (emailError) {
                  setEmailError(null); // 👈 clear error while typing
                  setIsEmailFocused(true);
                }
              }}
              // underlineColor={theme.colors.inputs.bottom_lines_disabled}
              border_color={theme.colors.inputs.bottom_lines_disabled}
              underlineColor={theme.colors.inputs.bottom_lines_disabled}
              border_width={"0.3px"}
              activeUnderlineColor={theme.colors.ui.primary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              autoComplete="name"
              returnKeyType="done"
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              blurOnSubmit
            />
            {/* <Spacer position="top" size="extraLarge" /> */}
            {emailError && !isEmailFocused && !isValidEmail(userEmail) && (
              <Container
                width="100%"
                height="10%"
                color={theme.colors.bg.elements_bg}
                justify="flex-start"
                align="flex-start"
              >
                <Spacer position="top" size="large" />
                <Spacer position="left" size="large">
                  <Text variant="dm_sans_bold_14" style={{ color: "red" }}>
                    Please enter a valid email address
                  </Text>
                </Spacer>
              </Container>
            )}
          </Container>
          <Spacer position="top" size="extraLarge" />

          <Container
            width="100%"
            // height="55%"
            color={theme.colors.bg.elements_bg}
            //   color={"yellow"}
            align="center"
            direction="row"
          >
            {isEmailFocused && isValidEmail(userEmail) && userEmail !== "" && (
              <Regular_CTA
                // width="55%"
                // height={60}
                width="200px"
                height={"65px"}
                color={theme.colors.ui.primary}
                border_radius={"40px"}
                caption="Get orders"
                caption_text_variant="dm_sans_bold_20_white"
                action={async () => {
                  if (!isValidEmail(userEmail)) {
                    setEmailError("Please enter a valid email address.");
                    return;
                  }
                  const ordersByEmail = await getCustomersOrdersByEmail(
                    userEmail
                  );
                  if (ordersByEmail.length !== 0) {
                    navigation.navigate("New_Orders_View", {
                      orders: ordersByEmail,
                    });
                    setLastScannedToken(token);
                  }
                  // Do request
                }}
              />
            )}
          </Container>
        </Container>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
