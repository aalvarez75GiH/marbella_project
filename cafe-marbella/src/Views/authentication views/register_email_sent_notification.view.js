import React, { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";

import { navigationRef } from "../../infrastructure/navigation/navigation_ref.js";
import { Pressable_Container } from "../../components/containers/general.containers.js";
import { Container } from "../../components/containers/general.containers.js";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component.js";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component.js";
import { Text } from "../../infrastructure/typography/text.component.js";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
import { Snack_Bar_Component } from "../../components/others/snack_bar.component.js";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

export default function Register_Email_Sent_Notification_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();
  const route = useRoute();

  const { email, returnTo } = route?.params ?? {};

  const { showErrorSnackbar, snackbar, hideSnackbar } =
    useContext(GlobalContext);
  console.log("RETURN TO AT NEW SCREEN:", JSON.stringify(returnTo, null, 2));
  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
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
            navigation.goBack();
          }}
        />

        <Container
          width="100%"
          height="80%"
          color={theme.colors.bg.elements_bg}
          //color={"yellow"}
          align="flex-start"
        >
          <Container
            width="100%"
            height="60%"
            color={theme.colors.bg.elements_bg}
            //color={"yellow"}
            align="center"
            justify="center"
          >
            <Image
              source={require("../../../assets/my_icons/email_icon.png")}
              style={{
                width: "60%",
                height: "60%",
              }}
              contentFit="cover" // replaces resizeMode
              transition={300} // smooth fade-in
            />
            <Container
              width="100%"
              height="60%"
              color={theme.colors.bg.elements_bg}
              //color={"yellow"}
              align="center"
              justify="center"
            >
              <Text variant="raleway_bold_26">Account created!</Text>
              <Spacer position="top" size="medium" />
              <Spacer position="top" size="medium" />

              <Spacer position="left" size="extraLarge">
                <Text variant="raleway_regular_18" textAlign="center">
                  We've sent your new PIN to:
                  {/* {t("authentication_views.code_verification_view.title_1")} */}
                </Text>
                <Text variant="raleway_bold_18" style={{ textAlign: "center" }}>
                  {email}
                </Text>
              </Spacer>
              <Spacer position="top" size="extraLarge" />
              <Spacer position="top" size="extraLarge" />
              <Spacer position="left" size="extraLarge">
                <Text
                  variant="raleway_regular_18"
                  textAlign="center"
                  style={{ textAlign: "center" }}
                >
                  Check your email and use the PIN
                  {/* {t("authentication_views.code_verification_view.title_2")} */}
                </Text>
                <Text
                  variant="raleway_regular_18"
                  textAlign="center"
                  style={{ textAlign: "center" }}
                >
                  to access your account
                  {/* {t("authentication_views.code_verification_view.title_2")} */}
                </Text>
                <Spacer position="top" size="large" />
                <Text
                  variant="raleway_regular_12"
                  textAlign="center"
                  style={{ textAlign: "center" }}
                >
                  (you can change it later using a menu option)
                  {/* {t("authentication_views.code_verification_view.title_2")} */}
                </Text>
              </Spacer>
              <Spacer position="top" size="small" />
            </Container>
          </Container>
        </Container>
        <Regular_CTA
          width="75%"
          height={"60px"}
          color={theme.colors.ui.primary}
          border_radius={"40px"}
          caption="Continue shopping"
          caption_text_variant="dm_sans_bold_20_white"
          action={() => {
            navigation.getParent()?.goBack();

            requestAnimationFrame(() => {
              navigationRef.current?.navigate("App", {
                screen: returnTo?.tab ?? "Shop",
                params: {
                  screen: returnTo?.screen ?? "Shop_Products_View",
                  params: returnTo?.params ?? {},
                },
              });
            });
          }}
        />
      </Container>
      <Snack_Bar_Component
        snackbar={snackbar}
        bottom_ios={40}
        bottom_android={40}
      />
    </SafeArea>
  );
}
