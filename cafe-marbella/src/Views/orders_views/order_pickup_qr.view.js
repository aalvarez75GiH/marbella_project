import React, { useEffect, useState, useRef } from "react";
import QRCode from "react-native-qrcode-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, onSnapshot } from "firebase/firestore"; // make sure to import your Firestore instance and the onSnapshot function
import { db } from "../../../fb.js"; // adjust the path to your Firestore instance

import { Container } from "../../components/containers/general.containers";
import { theme } from "../../infrastructure/theme/index";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";

export default function Order_Pickup_QR_View() {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId, token, size } = route.params;
  const qrValue = `marbella://pickup/${token}`;

  const [screenState, setScreenState] = useState("idle");
  // idle | finishing | finished

  const handledFinishRef = useRef(false);
  const finishTimerRef = useRef(null);

  const clearFinishTimer = () => {
    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  };

  useEffect(() => {
    handledFinishRef.current = false;
    clearFinishTimer();
    setScreenState("idle");

    return () => {
      clearFinishTimer();
    };
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;

    const unsub = onSnapshot(doc(db, "orders", orderId), (snap) => {
      if (!snap.exists()) return;

      const order = snap.data();
      const status = order?.order_status;

      console.log("LIVE ORDER UPDATE:", status);

      if (status === "In Progress") {
        handledFinishRef.current = false;
        clearFinishTimer();
        setScreenState("idle");
        return;
      }

      if (status === "Finished") {
        if (!handledFinishRef.current) {
          handledFinishRef.current = true;
          clearFinishTimer();
          setScreenState("finishing");

          finishTimerRef.current = setTimeout(() => {
            setScreenState("finished");
            finishTimerRef.current = null;
          }, 1200);
        }
        return;
      }
    });

    return () => {
      unsub();
      clearFinishTimer();
    };
  }, [orderId]);

  if (screenState === "finishing") {
    return (
      <SafeArea
        background_color={theme.colors.bg.elements_bg}
        style={{ flex: 1 }}
      >
        <Container width="100%" height="100%" justify="center" align="center">
          <Global_activity_indicator
            caption="Wait, we are finishing up your order..."
            caption_width="65%"
            // color={"red"}
          />
          {/* <ActivityIndicator size="large" /> */}
          <Spacer position="top" size="large" />
          <Text variant="dm_sans_bold_18">Updating your order...</Text>
        </Container>
      </SafeArea>
    );
  }

  if (screenState === "finished") {
    return (
      <SafeArea
        background_color={theme.colors.bg.elements_bg}
        style={{ flex: 1 }}
      >
        <Container
          width="100%"
          height="100%"
          justify="center"
          align="center"
          color={theme.colors.bg.elements_bg}
        >
          <Text variant="dm_sans_bold_20">Thank you for trusting us!</Text>
          <Spacer position="top" size="medium" />
          <Text variant="dm_sans_regular_16">
            Your order has been marked as finished.
          </Text>
          <Spacer position="top" size="extraLarge" />
          <Regular_CTA
            width="65%"
            height="8%"
            color={theme.colors.ui.primary}
            border_radius={"40px"}
            caption={"Continue"}
            caption_text_variant="dm_sans_bold_20_white"
            // disabled={isLoading} // ✅ prevent double taps if your CTA supports it
            action={() => {
              setScreenState("idle");
              navigation.popToTop();
            }}
          />
        </Container>
      </SafeArea>
    );
  }
  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Go_Back_Header
        action={() => navigation.goBack()}
        label="Order pickup QR code"
      />

      <Container
        justify="center"
        align="center"
        color={theme.colors.bg.elements_bg}
      >
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        <QRCode
          value={qrValue}
          size={size}
          backgroundColor="white"
          color="black"
        />
        <Spacer position="top" size="large" />
        <Spacer position="top" size="large" />
        <Text variant="dm_sans_bold_16"> Show this QR code at merchant</Text>
      </Container>
    </SafeArea>
  );
}
