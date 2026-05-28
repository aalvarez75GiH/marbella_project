import React, { useContext, useState, useRef, useEffect, useMemo } from "react";
import { Platform, Keyboard } from "react-native";
import { Image } from "expo-image";
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

export default function Login_Screen_For_Switching_Accounts_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();

  const pinInputRef = useRef(null);
  const shouldRefocusPinRef = useRef(false);

  const route = useRoute();
  const { emailToSwitch, returnTo } = route.params || {};

  const { snackbar, hideSnackbar, showSuccessSnackbar, showErrorSnackbar } =
    useContext(GlobalContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [switched, setSwitched] = useState(false);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      requestAnimationFrame(() => {
        pinInputRef.current?.focus();
      });
    }, 80);

    return () => {
      setPin("");
      hideSnackbar();
      clearTimeout(timeout);
    };
  }, []);

  console.log("Login for switching accounts, email:", emailToSwitch);
  console.log("PIN value:", pin);
  console.log("Can submit?", canSubmit);

  useEffect(() => {
    if (!isSubmitting && shouldRefocusPinRef.current) {
      shouldRefocusPinRef.current = false;

      const showSub = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
        () => {
          setTimeout(() => {
            showErrorSnackbar(
              t("menu.switch_account_view.pin_switch_view.snack_bar_error"),
              () => {
                setPin("");
                hideSnackbar();
              }
            );
          }, 120);

          showSub.remove();
        }
      );

      requestAnimationFrame(() => {
        pinInputRef.current?.focus();
      });

      return () => {
        showSub.remove();
      };
    }
  }, [isSubmitting]);

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

    setIsSubmitting(true);
    // setError(null);
    lockCartInit(true);

    try {
      console.log("CTA: start login for switching");

      // 1) login target user
      const result = await loginUser(pin, emailToSwitch);

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

      if (result?.ok || result?.user) {
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
        showSuccessSnackbar(
          t("menu.switch_account_view.pin_switch_view.snack_bar"),
          () => {
            hideSnackbar();
            goToFinalDestination();
          }
        );

        setSwitched(true);
      }
    } catch (e) {
      console.log("CTA SWITCH LOGIN ERROR:", e?.message ?? e, e);

      shouldRefocusPinRef.current = true;

      showErrorSnackbar(
        t("menu.switch_account_view.pin_switch_view.snack_bar_error"),
        () => {
          hideSnackbar();

          setTimeout(() => {
            pinInputRef.current?.focus();
          }, 150);
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      {isSubmitting && (
        <Global_activity_indicator
          caption={t(
            "menu.switch_account_view.pin_switch_view.activity_indicator"
          )}
          caption_width="65%"
        />
      )}

      {!isSubmitting && !switched && (
        <>
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
              height={"10%"}
              color={theme.colors.bg.elements_bg}
              align="flex-start"
            >
              <Spacer position="left" size="large">
                <Spacer position="left" size="small">
                  <Text variant="raleway_bold_18" textAlign="center">
                    {t("menu.switch_account_view.pin_switch_view.caption")}
                  </Text>
                </Spacer>
              </Spacer>
            </Container>

            <DataInput
              ref={pinInputRef}
              label={t("menu.switch_account_view.pin_switch_view.data_input")}
              value={pin}
              fontFamily="DMSans-Bold"
              onChangeText={(value) => {
                hideSnackbar();
                const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
                setPin(digitsOnly);
              }}
              activeUnderlineColor="#3A2F01"
              underlineColor="transparent"
              keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="none"
              autoComplete="off"
              // returnKeyType="done"
              blurOnSubmit
              secureTextEntry
            />
            <Spacer position="top" size="extraLarge" />
            {emailToSwitch && pin && canSubmit && (
              <Container
                width="100%"
                padding_vertical={"2%"}
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
                  width="35%"
                  height={"35%"}
                  color={theme.colors.ui.primary}
                  border_radius={"40px"}
                  caption={t("menu.switch_account_view.pin_switch_view.cta")}
                  caption_text_variant="dm_sans_bold_18_white"
                  action={handleSwitch}
                />
              </Container>
            )}
          </Container>
        </>
      )}
      {!isSubmitting && switched && (
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          justify="center"
          align="center"
        >
          <Container
            width="60%"
            height="30%"
            color={theme.colors.bg.elements_bg}
            align="center"
            justify="center"
          >
            <Image
              source={require("../../../assets/my_icons/switch_icon.png")}
              style={{
                width: "80%",
                height: "80%",
              }}
              contentFit="cover" // replaces resizeMode
              transition={300} // smooth fade-in
            />
            <Spacer position="top" size="large" />
            <Text variant="dm_sans_bold_24">
              {t("menu.switch_account_view.pin_switch_view.switched")}
            </Text>
          </Container>
        </Container>
      )}
      <Snack_Bar_Component
        snackbar={snackbar}
        bottom_ios={switched ? 60 : 290}
        bottom_android={switched ? 80 : 290}
      />
    </SafeArea>
  );
}
