import React, { useContext, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";
import { Snackbar } from "react-native-paper";

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
import { Snack_Bar_Component } from "../../components/others/snack_bar.component.js";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { CartContext } from "../../infrastructure/services/cart/cart.context.js";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

export default function Login_Users_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();
  const emailInputRef = useRef(null);
  const pinInputRef = useRef(null);

  const {
    cart,
    setCart,
    gettingCartByUserID,
    mergeCartGuestOverridesDb,
    upsertCart,
    lockCartInit,
    clearGuestCart,
  } = useContext(CartContext);
  const { prepareOrderFromCart } = useContext(OrdersContext);
  const { isValidEmail, snackbar, showErrorSnackbar, hideSnackbar } =
    useContext(GlobalContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState(null);

  const {
    email,
    setEmail,
    setPin,
    pin,
    loginUser,
    emailError,
    setEmailError,
    isValidPin,
  } = useContext(AuthenticationContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      emailInputRef.current?.focus();
    }, 300); // slight delay for modal animation

    return () => clearTimeout(timeout);
  }, []);

  const route = useRoute();
  const { returnTo } = route?.params ?? {};
  console.log("RETURN TO:", returnTo);
  console.log("EMAIL:", email);
  console.log("PIN:", pin);

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      {isSubmitting ? (
        <Global_activity_indicator
          caption={t("login_screen.activity_indicator")}
          caption_width="65%"
          // color={"red"}
        />
      ) : (
        <>
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
              <Go_Back_Header
                label=""
                action={() => {
                  setEmail("");
                  setEmailError(null);
                  setPin("");
                  navigation.goBack();
                }}
              />

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
                height={emailError || error ? "25%" : "20%"} // shrink if there's an error to make room
                color={theme.colors.bg.elements_bg}
                align="flex-start"
              >
                <Spacer position="left" size="extraLarge">
                  <Text variant="raleway_bold_18" textAlign="center">
                    {t("login_screen.title")}
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
                  ref={emailInputRef}
                  fontFamily="DMSans-Bold"
                  label={t("login_screen.data_input_email")}
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (emailError) {
                      setEmailError(null); // 👈 clear error while typing
                    }
                  }}
                  border_color={theme.colors.inputs.bottom_lines_disabled}
                  underlineColor={theme.colors.inputs.bottom_lines_disabled}
                  border_width={"0.5px"}
                  activeUnderlineColor={theme.colors.ui.primary}
                  keyboardType="email-address"
                  autoCorrect={false}
                  returnKeyType="done"
                  autoComplete="off"
                  textContentType="none"
                  autoCapitalize="none"
                  importantForAutofill="no"
                  spellCheck={false}
                  right={
                    email ? (
                      <TextInput.Icon
                        icon="close-circle"
                        style={{ marginTop: 30 }}
                        size={18}
                        color={"#BEC5C5"}
                        onPress={() => {
                          setEmail("");
                          hideSnackbar();

                          setTimeout(() => {
                            emailInputRef.current?.focus();
                          }, 50);
                        }}
                      />
                    ) : null
                  }
                />
                {!email && emailTouched && (
                  <Spacer position="top" size="extraLarge" />
                )}

                <DataInput
                  ref={pinInputRef}
                  fontFamily="DMSans-Bold"
                  label={t("login_screen.data_input_pin")}
                  value={pin}
                  onChangeText={(value) => {
                    hideSnackbar();
                    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
                    setPin(digitsOnly);
                    if (error) {
                      setError(null); // 👈 clear error while typing
                    }
                  }}
                  underlineColor={theme.colors.inputs.bottom_lines_disabled}
                  border_color={theme.colors.inputs.bottom_lines_disabled}
                  border_width={"0.5px"}
                  activeUnderlineColor={theme.colors.ui.primary}
                  keyboardType={
                    Platform.OS === "ios" ? "number-pad" : "numeric"
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="Password"
                  autoComplete="email"
                  // returnKeyType="done"
                  onFocus={() => setEmailTouched(true)}
                  onBlur={() => setEmailTouched(false)}
                  secureTextEntry
                  blurOnSubmit
                />
              </Container>
              <Spacer position="top" size="extraLarge" />
              {!email && !pin && (
                <>
                  <Spacer position="top" size="extraLarge" />
                  <Container
                    width="100%"
                    height="10%"
                    color={theme.colors.bg.elements_bg}
                    //   color={"yellow"}
                    align="center"
                    direction="row"
                  >
                    <Underlined_CTA
                      width="50%"
                      height={"40%"}
                      caption={t("shop_login_user_view.forgot_cta")}
                      color="transparent"
                      action={() => null}
                      border_color="#898989"
                    />
                    <Underlined_CTA
                      width="50%"
                      height={"40%"}
                      caption={t("shop_login_user_view.sign_up_cta")}
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
                </>
              )}
              <Spacer position="top" size="large" />
              {email && pin && isValidPin && (
                <Container
                  width="100%"
                  padding_vertical={emailError || error ? "0%" : "2%"} // shrink if there's an error to make room
                  color={theme.colors.bg.elements_bg}
                  //color={"red"}
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
                    width="150px"
                    height={"55px"}
                    color={theme.colors.ui.primary}
                    border_radius={"40px"}
                    caption="Log In"
                    caption_text_variant="dm_sans_bold_20_white"
                    action={async () => {
                      if (isSubmitting) return; // prevent double taps

                      if (!isValidEmail(email)) {
                        showErrorSnackbar(t("login_screen.email_login_error"));

                        setTimeout(() => {
                          emailInputRef.current?.focus();
                        }, 100);

                        return;
                      }

                      setIsSubmitting(true);
                      lockCartInit(true);
                      try {
                        console.log("CTA: start login");

                        // 0) login
                        const result = await loginUser(pin, email);
                        console.log(
                          "CTA: login result",
                          JSON.stringify(result, null, 2)
                        );

                        if (!result?.ok) {
                          showErrorSnackbar(result?.error, () => {
                            setPin("");
                            hideSnackbar();
                          });

                          setTimeout(() => {
                            pinInputRef.current?.focus();
                          }, 100);

                          return;
                        }
                        //0.1) sanity check
                        setPin("");
                        setEmail("");
                        setEmailError(null);

                        const nextUser = {
                          ...result.user,
                          authenticated: true,
                        };
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
                        // setCartTotalItems(getTotalCartQuantity(mergedCart));

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
                              // screen:
                              // returnTo?.screen ?? "Shop_Delivery_Type_View",
                              screen: returnTo?.screen,
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
            <Snack_Bar_Component
              snackbar={snackbar}
              bottom_ios={240}
              bottom_android={290}
            />
          </KeyboardAvoidingView>
        </>
        // your normal UI
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
