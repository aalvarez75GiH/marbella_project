import React, { useContext, useState, useMemo } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
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

export default function Enter_Phone_Number_View() {
  const navigation = useNavigation();
  const theme = useTheme();

  const { setUserToDB, userToDB } = useContext(AuthenticationContext);

  // If your GlobalContext has validation helpers, use them; otherwise fallback locally.
  const global = useContext(GlobalContext);

  const isValidPhone =
    global?.isValidPhone ||
    ((phone) => {
      // Accept US-style 10 digits (ignores formatting chars)
      const digits = String(phone || "").replace(/\D/g, "");
      return digits.length === 10;
    });

  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [phoneError, setPhoneError] = useState(null);

  const onlyDigits = (s = "") => String(s).replace(/\D/g, "");
  //   const showCTA = isPhoneComplete; // ✅ CTA only when complete

  const formatPhone = (input = "") => {
    const digits = onlyDigits(input).slice(0, 10);

    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)})${digits.slice(3)}`;
    return `(${digits.slice(0, 3)})${digits.slice(3, 6)}.${digits.slice(6)}`;
  };

  const phoneDigits = useMemo(
    () => onlyDigits(userToDB?.phone_number || ""),
    [userToDB?.phone_number]
  );
  const isPhoneComplete = phoneDigits.length === 10; // ✅ exactly 10 digits

  const showCTA = isPhoneFocused && isPhoneComplete;
  console.log("SHOW CTA:", showCTA);
  //   const showCTA = isPhoneFocused || phoneDigits.length > 0;

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled={isPhoneFocused} // ✅ only when typing
        behavior={Platform.OS === "ios" ? undefined : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          justify="flex-start"
          align="center"
        >
          <Go_Back_Header label="" action={() => navigation.goBack()} />

          {/* Title */}

          {/* Input */}
          <Container
            width="100%"
            height="30%"
            color={theme.colors.bg.elements_bg}
            align="center"
            direction="column"
            //color={"blue"}
          >
            <Container
              width="100%"
              height="20%"
              color={theme.colors.bg.elements_bg}
              align="flex-start"
            >
              <Spacer position="left" size="extraLarge">
                <Text variant="raleway_bold_18" textAlign="center">
                  Enter your phone number
                </Text>
              </Spacer>
            </Container>
            <Spacer position="top" size="large" />
            <DataInput
              label="Phone Number"
              value={userToDB?.phone_number || ""}
              //   onChangeText={(value) => {
              //     setUserToDB({ ...userToDB, phone_number: value });

              //     // Hide error while user is fixing it
              //     if (phoneError) setPhoneError(null);
              //   }}
              onChangeText={(value) => {
                const formatted = formatPhone(value);

                setUserToDB({ ...userToDB, phone_number: formatted });

                if (phoneError) setPhoneError(null);
              }}
              border_color={theme.colors.inputs.bottom_lines_disabled}
              underlineColor={theme.colors.inputs.bottom_lines_disabled}
              border_width={1}
              activeUnderlineColor={theme.colors.ui.primary}
              keyboardType={Platform.OS === "ios" ? "number-pad" : "phone-pad"}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="telephoneNumber"
              autoComplete="tel"
              returnKeyType="done"
              onFocus={() => setIsPhoneFocused(true)}
              onBlur={() => setIsPhoneFocused(false)}
              blurOnSubmit
            />

            <Spacer position="top" size="extraLarge" />
          </Container>

          {/* Error (only when user is NOT typing) */}
          {phoneError &&
            !isPhoneFocused &&
            !isValidPhone(userToDB?.phone_number) && (
              <Container
                width="100%"
                height="10%"
                color={"blue"}
                //   color={theme.colors.bg.elements_bg}
                justify="flex-start"
                align="flex-start"
              >
                <Spacer position="top" size="large" />
                <Spacer position="left" size="large">
                  <Text variant="dm_sans_bold_14" style={{ color: "red" }}>
                    Please enter a valid phone number
                  </Text>
                </Spacer>
              </Container>
            )}

          {/* CTA pinned bottom-ish using flex (Option A pattern) */}
          <Container
            width="100%"
            // style={{ flex: 1, paddingBottom: 16 }}
            color={theme.colors.bg.elements_bg}
            //color={"red"}
            align="center"
            justify="center"
            direction="row"
          >
            {showCTA && (
              <Regular_CTA
                width="55%"
                height={60}
                color={theme.colors.ui.primary}
                border_radius={"40px"}
                caption="Next"
                caption_text_variant="dm_sans_bold_20_white"
                action={() => {
                  if (!isValidPhone(userToDB?.phone_number)) {
                    setPhoneError("Please enter a valid phone number.");
                    return;
                  }
                  navigation.navigate("User_To_Create_Info_Review_View");
                }}
              />
            )}
          </Container>
        </Container>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
