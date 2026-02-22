import React, { useContext, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

import { navigationRef } from "../../infrastructure/navigation/navigation_ref.js";
import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
import { DataInput } from "../../components/inputs/data_text_input.js";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { CartContext } from "../../infrastructure/services/cart/cart.context.js";

export default function Reset_PIN_View() {
  const navigation = useNavigation();
  const theme = useTheme();

  const pinInputRef = useRef(null);
  const secondPinRef = useRef(null);

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
    canSubmit,
    // setPin, // (if you still expose it, but this screen doesn't need it)
  } = useContext(AuthenticationContext);

  const { lockCartInit } = useContext(CartContext);

  const [error, setError] = useState(null);

  // ✅ show "PIN must be 6 digits" ONLY after user tries to focus PIN2
  const [showPin1LengthError, setShowPin1LengthError] = useState(false);

  // Auto-focus first PIN input
  useEffect(() => {
    const timeout = setTimeout(() => {
      pinInputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  // Optional: auto-focus second input once first reaches 6 digits
  useEffect(() => {
    if (reset_pin_1.length === 6) {
      secondPinRef.current?.focus();
    }
  }, [reset_pin_1]);

  const validateFirstPinBeforeSecond = () => {
    // user is attempting to go to PIN2; now we validate PIN1 length
    setShowPin1LengthError(true);

    if (reset_pin_1.length < 6) {
      setError("PIN must be exactly 6 digits before continuing.");
      return false;
    }

    // ok
    setError(null);
    return true;
  };

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      {isSubmitting ? (
        <Global_activity_indicator
          caption="Wait, we are setting up your new PIN..."
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
                  Enter your new PIN...
                </Text>
              </Spacer>
            </Container>

            <Container
              width="100%"
              height="20%"
              color={theme.colors.bg.elements_bg}
              align="center"
              direction="column"
            >
              {/* PIN 1 */}
              <DataInput
                ref={pinInputRef}
                label="Pin number (only 6 digits)"
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
                textContentType="password"
                autoComplete="off"
                returnKeyType="done"
                blurOnSubmit
              />

              {/* ✅ show ONLY after user tries PIN2 */}
              {showPin1LengthError && reset_pin_1.length < 6 && (
                <Container
                  width="100%"
                  height="30%"
                  color={theme.colors.bg.elements_bg}
                  justify="flex-start"
                  align="flex-start"
                >
                  <Spacer position="top" size="medium" />
                  <Spacer position="left" size="large">
                    <Text variant="dm_sans_bold_14" style={{ color: "red" }}>
                      PIN must be 6 digits.
                    </Text>
                  </Spacer>
                </Container>
              )}

              {/* PIN 2 */}
              <DataInput
                ref={secondPinRef}
                label="Repeat pin number"
                value={reset_pin_2}
                onChangeText={(value) => {
                  const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
                  set_Reset_Pin_2(digitsOnly);
                  if (error) setError(null);
                }}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.5px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                autoComplete="off"
                returnKeyType="done"
                onFocus={() => {
                  const ok = validateFirstPinBeforeSecond();
                  if (!ok) {
                    pinInputRef.current?.focus(); // send back to PIN1
                  }
                }}
                blurOnSubmit
              />
            </Container>

            <Spacer position="top" size="extraLarge" />
            <Spacer position="top" size="extraLarge" />

            {canSubmit && (
              <Container
                width="100%"
                padding_vertical={"2%"}
                color={theme.colors.bg.elements_bg}
                align="flex-start"
                justify="center"
                direction="row"
              >
                <Regular_CTA
                  width="55%"
                  height={"45%"}
                  color={theme.colors.ui.primary}
                  border_radius={"40px"}
                  caption="Update PIN"
                  caption_text_variant="dm_sans_bold_20_white"
                  action={async () => {
                    if (isSubmitting) return;

                    setIsSubmitting(true);
                    lockCartInit(true);

                    try {
                      const result = await generatePinNumberOnDemand(
                        reset_pin_1
                      );

                      if (!result?.ok) {
                        setError(result?.error || "Pin generation failed");
                        return;
                      }

                      // ✅ clear fields on success
                      set_Reset_Pin_1("");
                      set_Reset_Pin_2("");
                      setShowPin1LengthError(false);
                      setError(null);

                      const parent = navigation.getParent();
                      if (parent?.canGoBack?.()) parent.goBack();

                      requestAnimationFrame(() => {
                        navigationRef.current?.navigate("App", {
                          screen: returnTo?.tab ?? "Shop",
                          params: {
                            screen: returnTo?.screen ?? "Home_View",
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
