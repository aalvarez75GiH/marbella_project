import React, { useContext, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";

import { navigationRef } from "../../infrastructure/navigation/navigation_ref.js";
import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { Snack_Bar_Component } from "../../components/others/snack_bar.component.js";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { CartContext } from "../../infrastructure/services/cart/cart.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

export default function Reset_PIN_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();

  const shouldFocusFirstPinRef = useRef(false);
  const shouldFocusSecondPinRef = useRef(false);

  const pinInputRef = useRef(null);
  const secondPinRef = useRef(null);

  const focusFirstPin = () => {
    setTimeout(() => {
      pinInputRef.current?.focus();
    }, 150);
  };

  const focusSecondPin = () => {
    setTimeout(() => {
      secondPinRef.current?.focus();
    }, 150);
  };

  const route = useRoute();
  const { returnTo } = route.params || {};
  console.log("RETURN TO:", returnTo);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    generatePinNumberOnDemand,
    reset_pin_1,
    set_Reset_Pin_1,
    reset_pin_2,
    set_Reset_Pin_2,
    firebaseReady,
    firebaseUser,
  } = useContext(AuthenticationContext);

  const canSubmitLocal =
    reset_pin_1.length === 6 &&
    reset_pin_2.length === 6 &&
    reset_pin_1 === reset_pin_2;

  const { lockCartInit } = useContext(CartContext);
  const { snackbar, showErrorSnackbar, hideSnackbar } =
    useContext(GlobalContext);

  // Auto-focus first PIN input
  useEffect(() => {
    const timeout = setTimeout(() => {
      pinInputRef.current?.focus();
    }, 300);
    return () => {
      set_Reset_Pin_1("");
      set_Reset_Pin_2("");
      clearTimeout(timeout);
    };
  }, []);

  // Optional: auto-focus second input once first reaches 6 digits
  useEffect(() => {
    if (reset_pin_1.length === 6) {
      secondPinRef.current?.focus();
    }
  }, [reset_pin_1]);

  // const validateFirstPinBeforeSecond = () => {
  //   setShowPin1LengthError(true);

  //   if (reset_pin_1.length < 6) {
  //     setError(null); // ✅ don't show "PIN must match"
  //     return false;
  //   }

  //   setError(null);
  //   return true;
  // };
  const validateFirstPinBeforeSecond = () => {
    const firstPin = reset_pin_1.trim();

    if (!firstPin) {
      showErrorSnackbar(
        t("menu.get_a_new_pin_view.pin_first_required_error"),
        () => {
          hideSnackbar();
          set_Reset_Pin_1("");
          focusFirstPin();
        }
      );

      focusFirstPin();
      return false;
    }

    if (firstPin.length < 6) {
      showErrorSnackbar(t("menu.get_a_new_pin_view.pin_length_error"), () => {
        hideSnackbar();
        set_Reset_Pin_1("");
        focusFirstPin();
      });

      focusFirstPin();
      return false;
    }

    return true;
  };

  console.log("pins:", {
    reset_pin_1,
    reset_pin_2,
    len1: reset_pin_1?.length,
    len2: reset_pin_2?.length,
    equals: reset_pin_1 === reset_pin_2,
  });

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      {isSubmitting ? (
        <Global_activity_indicator
          caption={t("menu.get_a_new_pin_view.activity_indicator")}
          caption_width="65%"
        />
      ) : (
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

            <Container
              width="100%"
              height="15%"
              color={theme.colors.bg.elements_bg}
            >
              <Image
                source={require("../../../assets/brand_images/marbella_cafe_especial_logo_transparent.png")}
                style={styles.image_1}
              />
            </Container>

            <Container
              width="100%"
              height={"25%"}
              color={theme.colors.bg.elements_bg}
              align="flex-start"
            >
              <Spacer position="left" size="extraLarge">
                <Text variant="raleway_bold_18" textAlign="center">
                  {t("menu.get_a_new_pin_view.title")}
                </Text>
              </Spacer>
            </Container>

            <Container
              width="100%"
              // height="20%"
              color={theme.colors.bg.elements_bg}
              align="center"
              direction="column"
            >
              {/* PIN 1 */}
              {/* <DataInput
                ref={pinInputRef}
                fontFamily="DMSans-Bold"
                label={t("menu.get_a_new_pin_view.data_input_1")}
                value={reset_pin_1}
                onChangeText={(value) => {
                  const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
                  set_Reset_Pin_1(digitsOnly);

                  // ✅ hide pin-length error while user is fixing it
                  if (showPin1LengthError) setShowPin1LengthError(false);

                  // clear any error as they type
                  if (error) setError(null);
                }}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.5px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="Password"
                autoComplete="off"
                returnKeyType="done"
                blurOnSubmit
                secureTextEntry
              /> */}
              <DataInput
                ref={pinInputRef}
                fontFamily="DMSans-Bold"
                label={t("menu.get_a_new_pin_view.data_input_1")}
                value={reset_pin_1}
                onChangeText={(value) => {
                  hideSnackbar();

                  const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
                  set_Reset_Pin_1(digitsOnly);
                }}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.5px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="Password"
                autoComplete="off"
                // returnKeyType="done"
                blurOnSubmit
                secureTextEntry
              />

              {/* PIN 2 */}
              <DataInput
                ref={secondPinRef}
                fontFamily="DMSans-Bold"
                label={t("menu.get_a_new_pin_view.data_input_2")}
                value={reset_pin_2}
                onChangeText={(value) => {
                  hideSnackbar();

                  const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
                  set_Reset_Pin_2(digitsOnly);

                  if (
                    digitsOnly.length === 6 &&
                    reset_pin_1.length === 6 &&
                    reset_pin_1 !== digitsOnly
                  ) {
                    showErrorSnackbar(
                      t("menu.get_a_new_pin_view.pin_mismatch_error"),
                      () => {
                        hideSnackbar();
                        set_Reset_Pin_2("");
                        focusSecondPin();
                      }
                    );
                  }
                }}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.5px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="Password"
                autoComplete="off"
                // returnKeyType="done"
                secureTextEntry
                blurOnSubmit={false}
                onFocus={() => {
                  const ok = validateFirstPinBeforeSecond();

                  if (!ok) {
                    setTimeout(() => {
                      pinInputRef.current?.focus();
                    }, 100);
                  }
                }}
              />
              {/* <DataInput
                ref={secondPinRef}
                fontFamily="DMSans-Bold"
                label={t("menu.get_a_new_pin_view.data_input_2")}
                value={reset_pin_2}
                onChangeText={(value) => {
                  const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
                  set_Reset_Pin_2(digitsOnly);

                  if (digitsOnly.length === 6 && reset_pin_1.length === 6) {
                    if (reset_pin_1 !== digitsOnly) {
                      setError(t("menu.get_a_new_pin_view.pin_mismatch_error"));
                    } else {
                      setError(null);
                    }
                  } else {
                    setError(null);
                  }
                }}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.5px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="Password"
                autoComplete="off"
                returnKeyType="done"
                onFocus={() => {
                  const ok = validateFirstPinBeforeSecond();
                  if (!ok) {
                    pinInputRef.current?.focus(); // send back to PIN1
                  }
                }}
                blurOnSubmit
                secureTextEntry
              /> */}
            </Container>

            <Spacer position="top" size="large" />
            {canSubmitLocal && (
              <Container
                width="100%"
                padding_vertical={"2%"}
                style={{ paddingVertical: 16 }} // ✅ number, not percent
                color={theme.colors.bg.elements_bg}
                align="flex-start"
                justify="flex-start"
                direction="row"
              >
                <Container
                  width="5%"
                  height="100%"
                  color={theme.colors.bg.elements_bg}
                />
                <Regular_CTA
                  width="40%"
                  // height={"45%"}
                  height={56} // ✅ number, not percent
                  color={theme.colors.ui.primary}
                  border_radius={"40px"}
                  caption={t("menu.get_a_new_pin_view.cta")}
                  caption_text_variant="dm_sans_bold_16_white"
                  action={async () => {
                    console.log("✅ Update PIN CTA pressed");

                    if (isSubmitting) return;

                    // ✅ Don’t allow action until firebaseReady is true
                    if (!firebaseReady) {
                      setError(
                        "Session is still loading. Try again in a moment."
                      );
                      return;
                    }

                    setIsSubmitting(true);
                    lockCartInit(true);

                    try {
                      const result = await generatePinNumberOnDemand(
                        reset_pin_1
                      );

                      if (!result?.ok) {
                        setError(result?.error || "Pin update failed");
                        return;
                      }

                      set_Reset_Pin_1("");
                      set_Reset_Pin_2("");

                      if (result?.mustReLogin) {
                        Alert.alert(
                          "PIN updated",
                          "Please log in again using your new PIN."
                        );
                        navigationRef.current?.navigate("AuthModal", {
                          screen: "Login_View",
                        });
                        return;
                      }

                      const parent = navigation.getParent();
                      if (parent?.canGoBack?.()) parent.goBack();

                      requestAnimationFrame(() => {
                        navigationRef.current?.navigate("App", {
                          screen: returnTo?.tab ?? "Shop",
                          params: {
                            screen: returnTo?.screen ?? "Shop_Products_View",
                            params: returnTo?.params ?? {},
                          },
                        });
                      });
                    } catch (e) {
                      console.log("UPDATE PIN CTA ERROR:", e?.message ?? e);
                      setError("Something went wrong. Try again.");
                    } finally {
                      lockCartInit(false);
                      setIsSubmitting(false);
                    }
                  }}
                />
              </Container>
            )}
          </Container>
        </KeyboardAvoidingView>
      )}
      <Snack_Bar_Component
        snackbar={snackbar}
        bottom_ios={290}
        bottom_android={290}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  image_1: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  image_2: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
});
