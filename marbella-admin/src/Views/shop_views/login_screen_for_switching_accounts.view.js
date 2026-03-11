import React, { useContext, useState, useRef, useEffect, useMemo } from "react";
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

export default function Login_Screen_For_Switching_Accounts_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const pinInputRef = useRef(null);

  const route = useRoute();
  const { emailToSwitch, returnTo } = route.params || {};

  console.log("RETURN TO:", returnTo);
  console.log("EMAIL TO SWITCH:", emailToSwitch);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [pinToSwitch, setPinToSwitch] = useState("");

  const { setPin, pin, loginUser } = useContext(AuthenticationContext);

  const {
    cart,
    setCart,
    gettingCartByUserID,
    mergeCartGuestOverridesDb,
    upsertCart,
    lockCartInit,
    clearGuestCart,
  } = useContext(CartContext);

  const canSubmit = useMemo(() => /^\d{6}$/.test(pin), [pin]);
  const isValidPin = /^\d{6}$/.test(pin);

  useEffect(() => {
    const timeout = setTimeout(() => {
      pinInputRef.current?.focus();
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  const goToFinalDestination = () => {
    const targetTab = returnTo?.tab ?? "Shop";
    const targetScreen = returnTo?.screen ?? "Shop_Products_View";
    const targetParams = returnTo?.params ?? {};

    // Same stack flow: replace avoids briefly showing previous screen again
    if (targetTab === "Shop") {
      navigation.replace(targetScreen, targetParams);
      return;
    }

    // Cross-tab flow
    navigationRef.current?.navigate("App", {
      screen: targetTab,
      params: {
        screen: targetScreen,
        params: targetParams,
      },
    });
  };

  const handleSwitch = async () => {
    if (isSubmitting) return;

    if (!canSubmit) {
      setError("Please enter a valid 6-digit PIN.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    lockCartInit(true);

    try {
      console.log("CTA: start login for switching");

      // 1) login target user
      const result = await loginUser(pin, emailToSwitch);

      if (!result?.ok || !result?.user) {
        setError(result?.error || "Login failed");
        return;
      }

      const nextUser = { ...result.user, authenticated: true };
      const userId = nextUser.user_id;

      // 2) capture current local cart before switching
      const guestCart = cart;

      // 3) fetch target user's db cart without overwriting local state yet
      let dbCart = null;
      try {
        dbCart = await gettingCartByUserID(userId, { setState: false });
      } catch (e) {
        console.log(
          "CTA: no db cart or fetch failed, continuing with local cart",
          e?.message ?? e
        );
        dbCart = null;
      }

      // 4) merge carts
      const mergedCart = mergeCartGuestOverridesDb(dbCart, guestCart, userId);

      // 5) update local cart immediately
      setCart(mergedCart);

      // 6) persist merged cart
      await upsertCart(mergedCart);

      // 7) clear guest cart after successful upsert
      await clearGuestCart();

      // 8) go directly to final destination
      goToFinalDestination();
    } catch (e) {
      console.log("CTA SWITCH LOGIN ERROR:", e?.message ?? e, e);
      setError("Could not switch account. Please try again.");
    } finally {
      setIsSubmitting(false);
      lockCartInit(false);
      setPin("");
    }
  };

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      {isSubmitting ? (
        <Global_activity_indicator
          caption="Wait, we are logging you in..."
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
                  Enter PIN number to switch...
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
              <DataInput
                ref={pinInputRef}
                label="Pin number (only 6 digits)"
                value={pin}
                onChangeText={(value) => {
                  const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
                  setPin(digitsOnly);
                  setPinToSwitch(digitsOnly);
                  if (error) {
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
                textContentType="password"
                autoComplete="off"
                returnKeyType="done"
                onFocus={() => setEmailTouched(true)}
                onBlur={() => setEmailTouched(false)}
                blurOnSubmit
                secureTextEntry
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
            {emailToSwitch && pin && isValidPin && (
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
                  caption="Switch"
                  caption_text_variant="dm_sans_bold_20_white"
                  action={handleSwitch}
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
