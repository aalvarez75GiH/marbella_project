import React, { use, useContext, useEffect, useState } from "react";
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
import { Underlined_CTA } from "../../components/ctas/underlined.cta.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
import { DataInput } from "../../components/inputs/data_text_input.js";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { CartContext } from "../../infrastructure/services/cart/cart.context.js";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context.js";

export default function Login_Users_View() {
  const navigation = useNavigation();
  const theme = useTheme();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPinFocused, setIsPinFocused] = useState(false);

  const { user, email, setEmail, setPin, pin, loginUser } = useContext(
    AuthenticationContext
  );

  const {
    cart,
    setCart,
    setCartTotalItems,
    getTotalCartQuantity,
    gettingCartByUserID,
    mergeCartGuestOverridesDb,
    upsertCart,
    lockCartInit,
    clearGuestCart,
  } = useContext(CartContext);
  const { prepareOrderFromCart } = useContext(OrdersContext);
  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState(null);

  const route = useRoute();
  const { comingFrom, returnTo } = route?.params ?? {};
  console.log("RETURN TO:", returnTo);
  console.log("EMAIL:", email);
  console.log("PIN:", pin);
  console.log("COMING TO LOGIN VIEW FROM:", comingFrom);
  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      {isSubmitting ? (
        <Global_activity_indicator
          caption="Wait, we are logging you in..."
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
              height="20%"
              color={theme.colors.bg.elements_bg}
              //   color={"yellow"}
              align="flex-start"
            >
              <Spacer position="left" size="extraLarge">
                <Text variant="raleway_bold_18" textAlign="center">
                  Let's start logging In...
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
                label="Enter email "
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                }}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.5px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                autoComplete="email"
                returnKeyType="done"
                blurOnSubmit
              />
              <Spacer position="top" size="extraLarge" />
              <DataInput
                label="Enter password "
                value={pin}
                onChangeText={(value) => {
                  setPin(value);
                  if (error) {
                    setError(null); // 👈 clear error while typing
                    setIsPinFocused(true);
                  }
                }}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.5px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType="password"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="Password"
                autoComplete="email"
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
            {!email && !pin && (
              <Container
                width="100%"
                height="10%"
                color={theme.colors.bg.elements_bg}
                //   color={"yellow"}
                align="center"
                direction="row"
              >
                <Spacer position="left" size="extraLarge" />
                <Underlined_CTA
                  width="50%"
                  height={"40%"}
                  caption="Forgot my password"
                  color="transparent"
                  action={() => null}
                  border_color="#898989"
                />
                <Underlined_CTA
                  width="50%"
                  height={"40%"}
                  caption="Sign Up"
                  color="transparent"
                  // action={() => navigation.navigate("Enter_Names_View")}
                  action={() =>
                    navigation.navigate("AuthModal", {
                      screen: "Enter_Names_View",
                      params: { returnTo }, // forward it
                    })
                  }
                  border_color="#898989"
                />
              </Container>
            )}
            <Spacer position="top" size="extraLarge" />
            {email && pin && (
              <Container
                width="100%"
                padding_vertical="16px"
                // style={{ flex: 1, paddingBottom: 16 }}
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
                  caption="Log In"
                  caption_text_variant="dm_sans_bold_20_white"
                  action={async () => {
                    if (isSubmitting) return; // prevent double taps
                    setIsSubmitting(true);
                    lockCartInit(true);
                    try {
                      console.log("CTA: start login");

                      // 0) login
                      const result = await loginUser(pin, email);

                      if (!result?.ok) {
                        setError(result?.error || "Login failed");
                        return;
                      }

                      const nextUser = { ...result.user, authenticated: true };
                      const userId = nextUser.user_id;

                      // 1) capture the cart you want to keep (guest cart from CartContext)
                      // IMPORTANT: use the cart that has qty=2 right now
                      const guestCart = cart;

                      // 2) fetch DB cart
                      let dbCart = null;
                      try {
                        dbCart = await gettingCartByUserID(userId, {
                          setState: false,
                        });
                      } catch (e) {
                        console.log(
                          "CTA: no db cart or fetch failed, continuing with guest cart",
                          e?.message ?? e
                        );
                      }

                      // 3) merge: guest overrides db
                      // If you already have mergeCartGuestOverridesDb, use it.
                      const mergedCart = mergeCartGuestOverridesDb(
                        dbCart,
                        guestCart,
                        userId
                      );

                      // 4) set local cart FIRST (so back shows qty=2)
                      setCart(mergedCart);
                      setCartTotalItems(getTotalCartQuantity(mergedCart));

                      // 5) persist merged cart to DB so your "fetch user cart" effect won't overwrite to qty=1
                      // (This is the key fix for your problem.)
                      await upsertCart(mergedCart);

                      // ✅ 5b) clear guest cart ONLY after successful upsert
                      await clearGuestCart();

                      // 6) build order from the same cart
                      prepareOrderFromCart(mergedCart, nextUser);

                      // 7) close auth modal (so Cart is underneath)
                      navigation.getParent()?.goBack();

                      // 8) navigate into the Cart stack delivery type (so GO_BACK works)
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
                      console.log("CTA ERROR:", e?.message ?? e, e);
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
