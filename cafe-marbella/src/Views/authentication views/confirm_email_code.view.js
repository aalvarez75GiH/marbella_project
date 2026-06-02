import React, { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";

import { Pressable_Container } from "../../components/containers/general.containers.js";
import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
import { Snack_Bar_Component } from "../../components/others/snack_bar.component.js";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

export default function Confirm_Email_Code_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();
  const route = useRoute();

  const {
    email_deliverable_code,
    forgot_pin_code,
    encrypted_pin,
    uid,
    user_id,
    email,
    returnTo,
    flow = "registration",
  } = route?.params ?? {};

  const realCode =
    flow === "forgot_pin" ? forgot_pin_code : email_deliverable_code;

  const { setUserToDB, userToDB } = useContext(AuthenticationContext);
  const { showErrorSnackbar, snackbar, hideSnackbar } =
    useContext(GlobalContext);

  console.log(
    "USER TO DB AT CODE VERIFICATION VIEW:",
    JSON.stringify(userToDB, null, 2)
  );
  console.log(
    "EMAIL AT CODE VERIFICATION VIEW:",
    JSON.stringify(email, null, 2)
  );

  console.log(
    "REAL CODE AT CODE VERIFICATION VIEW:",
    JSON.stringify(realCode, null, 2)
  );

  const [isEmailFocused, setIsEmailFocused] = useState(true);
  const [selectedCode, setSelectedCode] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const generatingRandomCodes = (realCode) => {
    const codes = new Set();

    // add real code first
    codes.add(String(realCode));

    // generate until we have 3 unique codes
    while (codes.size < 3) {
      const randomCode = String(Math.floor(100 + Math.random() * 900));

      codes.add(randomCode);
    }

    // shuffle
    return [...codes].sort(() => Math.random() - 0.5);
  };
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    const generated = generatingRandomCodes(realCode);

    setCodes(generated);
  }, [realCode]);

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
            height="20%"
            color={theme.colors.bg.elements_bg}
            // color={"yellow"}
            align="flex-start"
          >
            <Spacer position="left" size="extraLarge">
              <Text variant="raleway_regular_18" textAlign="center">
                {t("authentication_views.code_verification_view.title_1")}
                <Text variant="raleway_bold_18">{email}</Text>
              </Text>
            </Spacer>
            <Spacer position="top" size="large" />
            <Spacer position="left" size="extraLarge">
              <Text variant="raleway_regular_18" textAlign="center">
                {t("authentication_views.code_verification_view.title_2")}
              </Text>
            </Spacer>
            <Spacer position="top" size="small" />
          </Container>
          <Container
            width="100%"
            margin_top="40px"
            color={theme.colors.bg.elements_bg}
            direction="row"
          >
            {codes.map((item) => (
              <Pressable_Container
                key={item}
                width="25%"
                height="100px"
                margin_bottom="20px"
                margin_left="10px"
                border_radius="55px"
                color="#F7F2C9"
                border={`1.5px solid ${theme.colors.inputs.bottom_lines_disabled}`}
                align="center"
                justify="center"
                onPress={() => {
                  if (isLocked) return;

                  setSelectedCode(item);
                  setIsLocked(true);

                  if (item === String(realCode)) {
                    if (flow === "forgot_pin") {
                      navigation.navigate("AuthModal", {
                        screen: "Pin_Decrypted_View", // or whatever screen you create next
                        params: {
                          email,
                          encrypted_pin,
                          uid,
                          user_id,
                          returnTo,
                        },
                      });

                      return;
                    }

                    setUserToDB({
                      ...userToDB,
                      email,
                    });

                    navigation.navigate("AuthModal", {
                      screen: "Enter_Address_View",
                      params: { returnTo },
                    });

                    return;
                  }

                  showErrorSnackbar(
                    t(
                      "authentication_views.code_verification_view.snack_bar_error"
                    ),
                    () => {
                      hideSnackbar();
                      navigation.goBack();
                    }
                  );
                }}
              >
                <Text
                  variant="dm_sans_bold_28"
                  color={theme.colors.text.primary}
                >
                  {item}
                </Text>
              </Pressable_Container>
            ))}
          </Container>
        </Container>
      </KeyboardAvoidingView>
      <Snack_Bar_Component
        snackbar={snackbar}
        bottom_ios={40}
        bottom_android={40}
      />
    </SafeArea>
  );
}
