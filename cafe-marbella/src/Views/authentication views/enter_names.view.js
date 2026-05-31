import React, { useContext, useEffect, useState, useRef } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";

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

export default function Enter_Names_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();

  const { setUserToDB, userToDB } = useContext(AuthenticationContext);
  const { snackbar, hideSnackbar, showNameWarningSnackbar } =
    useContext(GlobalContext);

  const route = useRoute();
  const { returnTo } = route?.params ?? {};

  const firstNameDataInputRef = useRef(null);
  const lastNameDataInputRef = useRef(null);
  const firstNameIsValid = userToDB?.first_name?.trim().length > 0;
  const lastNameIsValid = userToDB?.last_name?.trim().length > 0;
  const canContinue = firstNameIsValid && lastNameIsValid;

  useEffect(() => {
    const timer = setTimeout(() => {
      firstNameDataInputRef.current?.focus();
    }, 100); // small delay helps with navigation transitions

    return () => clearTimeout(timer);
  }, []);

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
                {t("authentication_views.enter_names_view.title")}
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
              ref={firstNameDataInputRef}
              fontFamily="DMSans-Bold"
              label={t(
                "authentication_views.enter_names_view.data_input_first_name"
              )}
              value={userToDB.first_name}
              onChangeText={(value) => {
                hideSnackbar();
                setUserToDB({
                  ...userToDB,
                  first_name: value,
                  display_name: value,
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
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                if (firstNameIsValid) {
                  lastNameDataInputRef.current?.focus();
                }
              }}
            />
            <DataInput
              ref={lastNameDataInputRef}
              fontFamily="DMSans-Bold"
              label={t(
                "authentication_views.enter_names_view.data_input_last_name"
              )}
              value={userToDB.last_name}
              onChangeText={(value) => {
                setUserToDB({
                  ...userToDB,
                  last_name: value,
                });
              }}
              border_color={theme.colors.inputs.bottom_lines_disabled}
              underlineColor={theme.colors.inputs.bottom_lines_disabled}
              border_width={"0.3px"}
              activeUnderlineColor={theme.colors.ui.primary}
              keyboardType="default"
              autoCapitalize="words"
              autoCorrect={false}
              textContentType="familyName"
              autoComplete="name"
              returnKeyType="done"
              onFocus={() => {
                if (!firstNameIsValid) {
                  showNameWarningSnackbar(firstNameDataInputRef);

                  setTimeout(() => {
                    firstNameDataInputRef.current?.focus();
                  }, 150);

                  return;
                }
              }}
              blurOnSubmit
            />
            <Spacer position="top" size="extraLarge" />
          </Container>
          <Spacer position="top" size="medium" />
          <Container
            width="100%"
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
            />
            {canContinue && (
              <Regular_CTA
                width="35%"
                height={"60px"}
                color={theme.colors.ui.primary}
                border_radius={"40px"}
                caption={t("authentication_views.enter_names_view.cta")}
                // caption={"Continuar"}
                caption_text_variant="dm_sans_bold_20_white"
                action={async () =>
                  navigation.navigate("AuthModal", {
                    screen: "Enter_Email_View",
                    params: { returnTo },
                  })
                }
              />
            )}
          </Container>
        </Container>
      </KeyboardAvoidingView>
      <Snack_Bar_Component
        snackbar={snackbar}
        bottom_ios={310}
        bottom_android={310}
      />
    </SafeArea>
  );
}
