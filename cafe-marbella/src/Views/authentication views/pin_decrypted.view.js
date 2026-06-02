import React, { useEffect, useState, useContext } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Snack_Bar_Component } from "../../components/others/snack_bar.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { GlobalContext } from "../../infrastructure/services/global/global.context";
import { post_decrypt_pin_Request } from "../../infrastructure/services/authentication/authentication.sevices";

export default function Pin_Decrypted_View() {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { t } = useTranslation();

  const { showErrorSnackbar, snackbar } = useContext(GlobalContext);

  const { encrypted_pin, email, returnTo } = route?.params ?? {};

  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const decryptPin = async () => {
      if (!encrypted_pin) {
        showErrorSnackbar("Missing encrypted PIN.");
        return;
      }

      setIsLoading(true);

      try {
        const response = await post_decrypt_pin_Request(encrypted_pin);

        console.log("DECRYPT PIN RESPONSE:", JSON.stringify(response, null, 2));

        if (!response?.ok) {
          showErrorSnackbar(response?.error || "Could not recover PIN.");
          return;
        }

        setPin(response.pin);
      } catch (e) {
        console.log("DECRYPT PIN ERROR:", e?.message ?? e);
        showErrorSnackbar(e?.message || "Could not recover PIN.");
      } finally {
        setIsLoading(false);
      }
    };

    decryptPin();
  }, [encrypted_pin]);

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? undefined : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {isLoading ? (
          <Global_activity_indicator
            caption="Recovering your PIN..."
            caption_width="65%"
          />
        ) : (
          <Container
            width="100%"
            height="100%"
            color={theme.colors.bg.elements_bg}
            justify="flex-start"
            align="center"
          >
            <Container
              width="100%"
              height="20%"
              color={theme.colors.bg.elements_bg}
              align="flex-start"
            >
              <Spacer position="left" size="extraLarge">
                <Text variant="raleway_bold_18">
                  Your PIN has been recovered
                </Text>
              </Spacer>

              <Spacer position="top" size="large" />

              <Spacer position="left" size="extraLarge">
                <Text variant="raleway_regular_18">
                  This is the PIN linked to:
                </Text>
              </Spacer>

              <Spacer position="left" size="extraLarge">
                <Text variant="raleway_bold_18">{email}</Text>
              </Spacer>
            </Container>

            <Container
              width="90%"
              height="25%"
              color="#F7F2C9"
              border_radius="35px"
              align="center"
              justify="center"
              style={{
                borderWidth: 1.5,
                borderColor: theme.colors.inputs.bottom_lines_disabled,
              }}
            >
              <Text variant="dm_sans_bold_28" color={theme.colors.text.primary}>
                {pin || "------"}
              </Text>
            </Container>

            <Spacer position="top" size="extraLarge" />

            <Regular_CTA
              width="70%"
              height="60px"
              color={theme.colors.ui.primary}
              border_radius="40px"
              caption="Go to Login"
              caption_text_variant="dm_sans_bold_20_white"
              action={() => {
                navigation.navigate("Login_View", {
                  returnTo,
                  email,
                });
              }}
            />
          </Container>
        )}

        <Snack_Bar_Component
          snackbar={snackbar}
          bottom_ios={40}
          bottom_android={40}
        />
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
