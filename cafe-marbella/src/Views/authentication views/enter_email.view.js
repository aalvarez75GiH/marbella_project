import React, { useContext, useEffect, useState, useRef } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native-paper";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
import { Snack_Bar_Component } from "../../components/others/snack_bar.component.js";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component.js";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

export default function Enter_Email_View() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { setUserToDB, userToDB, validatingEmailDeliverability, isLoading } =
    useContext(AuthenticationContext);
  const { isValidEmail, showErrorSnackbar, snackbar, hideSnackbar } =
    useContext(GlobalContext);

  const theme = useTheme();

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [email, setEmail] = useState("");

  const route = useRoute();
  const { comingFrom, returnTo } = route?.params ?? {};

  const emailDataInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      emailDataInputRef.current?.focus();
    }, 100); // small delay helps with navigation transitions

    return () => clearTimeout(timer);
  }, []);

  console.log(
    "USER TO DB IN ENTER EMAIL VIEW:",
    JSON.stringify(userToDB, null, 2)
  );
  console.log(
    "EMAIL STATE AT ENTER EMAIL VIEW:",
    JSON.stringify(email, null, 2)
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
              <DataInput
                ref={emailDataInputRef}
                fontFamily="DMSans-Bold"
                label={t(
                  "authentication_views.enter_email_view.data_input_email"
                )}
                value={email}
                onChangeText={(value) => {
                  hideSnackbar();
                  setEmail(value);
                  if (emailError) {
                    setEmailError(null); // 👈 clear error while typing
                    setIsEmailFocused(true);
                  }
                }}
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
                right={
                  email ? (
                    <TextInput.Icon
                      icon="close-circle"
                      style={{ marginTop: 30 }}
                      size={18}
                      color={"#BEC5C5"}
                      onPress={() => {
                        hideSnackbar();
                        setEmail("");
                        setTimeout(() => {
                          emailDataInputRef.current?.focus();
                        }, 50);
                      }}
                    />
                  ) : null
                }
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
              {isEmailFocused && isValidEmail(email) && email !== "" && (
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
                    const isEmailDeliverable =
                      await validatingEmailDeliverability(email);

                    console.log(
                      "RESPONSE AT EMAIL VIEW:",
                      JSON.stringify(isEmailDeliverable, null, 2)
                    );

                    if (
                      !isEmailDeliverable?.ok ||
                      !isEmailDeliverable?.email_checked ||
                      !isEmailDeliverable?.email_sent
                    ) {
                      showErrorSnackbar(
                        t(
                          "authentication_views.enter_email_view.snack_bar_email_error"
                        )
                      );
                      return;
                    }

                    const { email_deliverable_code } = isEmailDeliverable;

                    navigation.navigate("AuthModal", {
                      screen: "Confirm_Email_Code_View",
                      params: {
                        returnTo,
                        email,
                        email_deliverable_code,
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
          bottom_ios={250}
          bottom_android={250}
        />
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
