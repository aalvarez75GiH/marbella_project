import React, { useLayoutEffect, useContext } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Pressable, View, Alert } from "react-native";

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

  const { user, signOut, isLoading } = useContext(AuthenticationContext);
  //   const { first_name, last_name, email, display_name, user_id } = user || {};
  console.log("Overlay_View user:", user);
  // Hiding tab bar for this screen
  const { setDeliveryOption } = useContext(OrdersContext);

  const { setNameOnCard } = useContext(PaymentsContext);

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
            {isLoading && <Global_activity_indicator />}
            {!isLoading && (
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
                      Are you sure about signing out?
                    </Text>
                  </Spacer>
                </Container>
                <Spacer position="top" size="extraLarge" />
                <Regular_CTA
                  caption="Yes, Sign me out"
                  width="90%"
                  height="56px"
                  color={theme.colors.ui.error}
                  caption_text_variant="raleway_bold_16_white"
                  action={() => {
                    console.log("CTA: Sign out pressed ✅");

                    (async () => {
                      console.log("CTA: lockCartInit?", typeof lockCartInit);
                      console.log(
                        "CTA: saveCartAsGuest?",
                        typeof saveCartAsGuest
                      );
                      console.log("CTA: signOut?", typeof signOut);

                      lockCartInit?.(true);

                      try {
                        console.log("CTA: step 1 setDeliveryOption");
                        await setDeliveryOption(null);

                        console.log("CTA: step 2 setNameOnCard");
                        setNameOnCard("");

                        console.log("CTA: step 3 saveCartAsGuest");
                        const saved = await saveCartAsGuest?.(cart);
                        console.log("CTA: saved guest cart?", !!saved);

                        console.log("CTA: step 4 signOut");
                        await signOut?.();

                        console.log("CTA: signOut finished ✅");
                      } catch (e) {
                        console.log(
                          "CTA: signOut flow ERROR ❌",
                          e?.message ?? e,
                          e
                        );
                        Alert.alert(
                          "Sign out error",
                          e?.message ?? "Unknown error"
                        );
                      } finally {
                        lockCartInit?.(false);
                        console.log("CTA: finally unlock ✅");
                      }
                    })();
                  }}
                />

                <Container />
              </Container>
            )}
          </Pressable>
        </View>
      </View>
    </SafeArea>
  );
}
