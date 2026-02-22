import React, { useContext, useEffect, useState } from "react";
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

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

export default function Enter_Email_View() {
  const navigation = useNavigation();

  const { setUserToDB, userToDB } = useContext(AuthenticationContext);
  const { isValidEmail } = useContext(GlobalContext);
  const global = useContext(GlobalContext);

  const theme = useTheme();

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState(null);

  const route = useRoute();
  const { comingFrom, returnTo } = route?.params ?? {};

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
          <Go_Back_Header label="" action={() => navigation.goBack()} />

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
              label="Email"
              value={userToDB.email}
              onChangeText={(value) => {
                setUserToDB({
                  ...userToDB,
                  email: value,
                });
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
              keyboardType="email"
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
            {emailError && !isEmailFocused && !isValidEmail(userToDB.email) && (
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
            {isEmailFocused && (
              <Regular_CTA
                width="55%"
                height={60}
                color={theme.colors.ui.primary}
                border_radius={"40px"}
                caption="Next"
                caption_text_variant="dm_sans_bold_20_white"
                action={() => {
                  setIsEmailFocused(false);
                  if (!isValidEmail(userToDB.email)) {
                    setEmailError("Please enter a valid email address.");
                    return;
                  }
                  navigation.navigate("AuthModal", {
                    screen: "Enter_Address_View",
                    params: { returnTo },
                  });
                }}
              />
            )}
          </Container>
        </Container>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
