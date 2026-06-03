import React, { useContext, useEffect, useState, useRef } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native-paper";

import { Container } from "../../components/containers/general.containers.js";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component.js";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component.js";
import { Text } from "../../infrastructure/typography/text.component.js";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
import { Snack_Bar_Component } from "../../components/others/snack_bar.component.js";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component.js";
import { EmailDataInput } from "../../components/inputs/email_data_input.js";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

export default function Forgot_PIN_View() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { checkEmailAndGetCustomerPIN, isLoading } = useContext(
    AuthenticationContext
  );
  const { isValidEmail, showErrorSnackbar, snackbar, hideSnackbar } =
    useContext(GlobalContext);

  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [focusEmailAfterError, setFocusEmailAfterError] = useState(false);

  const route = useRoute();
  const { comingFrom, returnTo } = route?.params ?? {};

  const emailDataInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      emailDataInputRef.current?.focus();
    }, 100); // small delay helps with navigation transitions

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && focusEmailAfterError) {
      const timer = setTimeout(() => {
        emailDataInputRef.current?.focus();
        setFocusEmailAfterError(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isLoading, focusEmailAfterError]);

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
        {isLoading ? (
          <Global_activity_indicator
            caption={t(
              "authentication_views.enter_email_view.activity_indicator"
            )}
            caption_width="65%"
          />
        ) : (
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
                // setIsEmailFocused(true);
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
                  {t("authentication_views.enter_email_view.title")}
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
              <EmailDataInput
                ref={emailDataInputRef}
                value={email}
                label={t(
                  "authentication_views.enter_email_view.data_input_email"
                )}
                onChangeText={(value) => {
                  hideSnackbar();
                  setEmail(value);
                }}
                textInputOnPress={() => {
                  hideSnackbar();
                  setEmail("");
                  setTimeout(() => {
                    emailDataInputRef.current?.focus();
                  }, 50);
                }}
              />
            </Container>

            <Container
              width="100%"
              // height="55%"
              color={theme.colors.bg.elements_bg}
              //   color={"yellow"}
              align="center"
              justify="flex-start"
              direction="row"
            >
              <Container
                width="5%"
                height="100%"
                color={theme.colors.bg.elements_bg}
                // color={"red"}
              />
              {isValidEmail(email) && email !== "" && (
                <Regular_CTA
                  // width="55%"
                  // height={60}
                  width="35%"
                  height={"60px"}
                  color={theme.colors.ui.primary}
                  border_radius={"40px"}
                  caption={t("authentication_views.enter_email_view.cta")}
                  caption_text_variant="dm_sans_bold_20_white"
                  action={async () => {
                    hideSnackbar();

                    const response = await checkEmailAndGetCustomerPIN(email);

                    console.log(
                      "FORGOT PIN RESPONSE AT VIEW:",
                      JSON.stringify(response, null, 2)
                    );

                    if (!response?.ok) {
                      setEmail("");
                      setFocusEmailAfterError(true);

                      showErrorSnackbar(t("login_screen.user_not_found_error"));
                      // showErrorSnackbar(
                      //   response?.error ||
                      //     t(
                      //       "authentication_views.enter_email_view.snack_bar_email_error"
                      //     )
                      // );

                      return;
                    }

                    navigation.navigate("AuthModal", {
                      screen: "Confirm_Email_Code_View",
                      params: {
                        returnTo,
                        email,

                        // new flow
                        forgot_pin_code: response.forgot_pin_code,

                        encrypted_pin: response.encrypted_pin,

                        uid: response.uid,
                        user_id: response.user_id,

                        // helpful so confirm screen knows
                        flow: "forgot_pin",
                      },
                    });
                  }}
                />
              )}
            </Container>
          </Container>
        )}
        <Snack_Bar_Component
          snackbar={snackbar}
          bottom_ios={270}
          bottom_android={270}
        />
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
