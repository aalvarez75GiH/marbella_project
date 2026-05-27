import React, { useLayoutEffect, useContext, useState } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Pressable, View, Alert } from "react-native";
import { useTranslation } from "react-i18next";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";
import { CartContext } from "../../infrastructure/services/cart/cart.context";

export default function Sign_Out_Overlay_View() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { user, signOut, isLoading } = useContext(AuthenticationContext);
  // Hiding tab bar for this screen
  const { setDeliveryOption } = useContext(OrdersContext);
  const { setNameOnCard } = useContext(PaymentsContext);

  const [localLoading, setLocalLoading] = useState(false);

  const { saveCartAsGuest, cart, lockCartInit } = useContext(CartContext);
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const runWithMinimumDelay = async (task, minDelay = 600) => {
    const start = Date.now();

    await task();

    const elapsed = Date.now() - start;
    const remaining = minDelay - elapsed;

    if (remaining > 0) {
      await wait(remaining);
    }
  };

  return (
    <SafeArea background_color={"transparent"} style={{ flex: 1 }}>
      {/* Full-screen backdrop */}
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }}>
        {/* Tap outside to dismiss */}
        <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()} />

        {/* Bottom sheet pinned to bottom */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "50%",
          }}
        >
          {/* Prevent closing when tapping inside the sheet */}
          <Pressable style={{ flex: 1 }} onPress={() => {}}>
            {localLoading && <Global_activity_indicator />}
            {!localLoading && (
              <Container
                width="100%"
                height="100%"
                color={theme.colors.bg.elements_bg}
                justify="flex-start"
                align="center"
                style={{
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  overflow: "hidden",
                }}
              >
                <Spacer position="top" size="extraLarge" />
                <Exit_Header_With_Label
                  label=""
                  action={() => navigation.goBack()}
                />

                <Spacer position="top" size="extraLarge" />
                <Container
                  width="100%"
                  height="10%"
                  color={theme.colors.bg.elements_bg}
                  justify="center"
                  align="flex-start"
                >
                  <Spacer position="left" size="extraLarge">
                    <Text variant="raleway_bold_20">
                      {t("menu.sign_out_layout.caption")}
                    </Text>
                  </Spacer>
                </Container>
                <Spacer position="top" size="extraLarge" />
                <Container
                  width="100%"
                  height="15%"
                  color={theme.colors.bg.elements_bg}
                  //color={"green"}
                  justify="flex-start"
                  align="flex-start"
                  direction="row"
                >
                  <Container
                    width="5%"
                    height="100%"
                    color={theme.colors.bg.elements_bg}
                  />
                  <Regular_CTA
                    caption={t("menu.sign_out_layout.cta")}
                    width="40%"
                    height="100%"
                    color={theme.colors.ui.error}
                    border_radius={"30px"}
                    caption_text_variant="raleway_bold_16_white"
                    action={() => {
                      if (localLoading) return;

                      (async () => {
                        setLocalLoading(true);
                        lockCartInit?.(true);

                        try {
                          await runWithMinimumDelay(async () => {
                            await setDeliveryOption(null);
                            setNameOnCard("");

                            await saveCartAsGuest?.(cart);

                            await signOut?.();
                          }, 700);

                          navigation.goBack();
                        } catch (e) {
                          Alert.alert(
                            "Sign out error",
                            e?.message ?? "Unknown error"
                          );
                        } finally {
                          lockCartInit?.(false);
                          setLocalLoading(false);
                        }
                      })();
                    }}
                  />
                </Container>

                <Container />
              </Container>
            )}
          </Pressable>
        </View>
      </View>
    </SafeArea>
  );
}
