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

  const route = useRoute();
  const { returnTo } = route.params || {};
  console.log("RETURN TO:", returnTo);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { generatePinNumberOnDemand, firebaseReady, firebaseUser } = useContext(
    AuthenticationContext
  );
  console.log("FIREBASE READY?:", firebaseReady);
  console.log("FIREBASE USER?:", firebaseUser);

  const { lockCartInit } = useContext(CartContext);

  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState(null);
  const [pinNumber_1, setPinNumber_1] = useState("");
  const [pinNumber_2, setPinNumber_2] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      pinInputRef.current?.focus();
    }, 300); // slight delay for modal animation

    return () => clearTimeout(timeout);
  }, []);

  const isValidEmail =
    global?.isValidEmail ||
    ((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase()));
  const isValidPin = /^\d{6}$/.test(pinNumber_1);

  //   console.log("COMING TO LOGIN VIEW FROM:", comingFrom);
  const canSubmit =
    firebaseReady &&
    !!firebaseUser &&
    pinNumber_1 === pinNumber_2 &&
    /^\d{6}$/.test(pinNumber_1);
  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      {isSubmitting ? (
        <Global_activity_indicator
          caption="Wait, we are setting up your new PIN..."
          caption_width="65%"
          // color={"red"}
        />
      ) : (
        // your normal UI
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              height={"25%"} // shrink if there's an error to make room
              color={theme.colors.bg.elements_bg}
              //   color={"yellow"}
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
              //   color={"yellow"}
              align="center"
              direction="column"
            >
              <DataInput
                ref={pinInputRef}
                label="Pin number (only 6 digits)"
                value={pinNumber_1}
                onChangeText={(value) => {
                  const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
                  setPinNumber_1(digitsOnly);
                  if (error) {
                    setError(null); // 👈 clear error while typing
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
                autoComplete="email"
                returnKeyType="done"
                onFocus={() => setEmailTouched(true)}
                onBlur={() => setEmailTouched(false)}
                blurOnSubmit
              />
              <DataInput
                label="Repeat pin number"
                value={pinNumber_2}
                onChangeText={(value) => {
                  const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
                  setPinNumber_2(digitsOnly);
                  if (error) {
                    setError(null); // 👈 clear error while typing
                  }
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
                onFocus={() => setEmailTouched(true)}
                onBlur={() => setEmailTouched(false)}
                blurOnSubmit
              />
              {error && (
                <Container
                  width="100%"
                  height="25%"
                  color={theme.colors.bg.elements_bg}
                  justify="flex-start"
                  align="flex-start"
                >
                  <Spacer position="top" size="large" />
                  <Spacer position="left" size="large">
                    <Text variant="dm_sans_bold_14" style={{ color: "red" }}>
                      {error}
                    </Text>
                  </Spacer>
                </Container>
              )}
            </Container>
            <Spacer position="top" size="extraLarge" />

            <Spacer position="top" size="extraLarge" />
            {/* {pinNumber_1 === pinNumber_2 && isValidPin && ( */}
            {canSubmit && (
              <Container
                width="100%"
                padding_vertical={"2%"} // shrink if there's an error to make room
                color={theme.colors.bg.elements_bg}
                //color={"red"}
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
                  //   action={() => generatePinNumberOnDemand(pinNumber_1)}
                  action={async () => {
                    if (isSubmitting) return;

                    setIsSubmitting(true);
                    lockCartInit(true);

                    try {
                      // 1) login
                      const result = await generatePinNumberOnDemand(
                        pinNumber_1
                      );
                      if (!result?.ok) {
                        setError(result?.error || "Pin generation failed");
                        return;
                      }

                      // 2) close modal if possible (avoid GO_BACK warning)
                      const parent = navigation.getParent();
                      if (parent?.canGoBack?.()) parent.goBack();

                      // 5) go where you want
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
                      console.log("SWITCH LOGIN CTA ERROR:", e?.message ?? e);
                      setError("Something went wrong. Try again.");
                    } finally {
                      lockCartInit(false);
                      setIsSubmitting(false);
                      setPin("");
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
