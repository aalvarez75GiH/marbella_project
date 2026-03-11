// Email_Verification_Sent_View.js
import React, { useContext, useMemo, useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { Container } from "../../components/containers/general.containers";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
import { Underlined_CTA } from "../../components/ctas/underlined.cta.js";
import { navigationRef } from "../../infrastructure/navigation/navigation_ref.js";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";

export default function Email_Verification_Sent_View() {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();

  const { pendingEmail } = route?.params ?? {};
  const { setEmail, setPin } = useContext(AuthenticationContext);

  const [isLoading, setIsLoading] = useState(false);

  const emailLabel = useMemo(() => pendingEmail ?? "", [pendingEmail]);

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Go_Back_Header label="" action={() => navigation.goBack()} />

      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        justify="flex-start"
        align="center"
      >
        <Spacer position="top" size="extraLarge" />

        <Container width="90%" color="transparent" align="flex-start">
          <Text variant="raleway_bold_18">Verify your new email</Text>
          <Spacer position="top" size="medium" />

          <Text variant="dm_sans_regular_14">
            We sent a verification link to:
          </Text>
          <Spacer position="top" size="small" />
          <Text variant="dm_sans_bold_16">{emailLabel}</Text>

          <Spacer position="top" size="large" />
          <Text variant="dm_sans_regular_14">
            1) Open your email and tap the verification link{"\n"}
            2) Come back here and tap{" "}
            <Text variant="dm_sans_bold_14">Continue</Text>
          </Text>
        </Container>

        <Spacer position="top" size="extraLarge" />

        <Regular_CTA
          width="220px"
          height={"65px"}
          color={theme.colors.ui.primary}
          border_radius={"40px"}
          caption={isLoading ? "Checking..." : "Continue"}
          caption_text_variant="dm_sans_bold_20_white"
          action={() => {
            setEmail("");
            setPin("");
            navigationRef.current?.navigate("App", {
              screen: "Shop",
              params: { screen: "Shop_Login_Users_View" },
            });
          }}
          disabled={isLoading}
        />

        <Spacer position="top" size="large" />
      </Container>
    </SafeArea>
  );
}
