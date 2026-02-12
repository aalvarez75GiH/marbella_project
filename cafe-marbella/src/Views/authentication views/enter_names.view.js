import React, { use, useContext, useEffect, useState } from "react";
import {
  FlatList,
  View,
  SectionList,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

import { Container } from "../../components/containers/general.containers";
import { Just_Caption_Header } from "../../components/headers/just_caption.header.js";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { Underlined_CTA } from "../../components/ctas/underlined.cta.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";

export default function Enter_Names_View() {
  const navigation = useNavigation();

  const { setUserToDB, userToDB } = useContext(AuthenticationContext);
  const theme = useTheme();

  const [isLastNameFocused, setIsLastNameFocused] = useState(false);

  const [error, setError] = useState(null);

  const route = useRoute();
  const { comingFrom, returnTo } = route?.params ?? {};

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? undefined : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // tweak if needed
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
            height="10%"
            color={theme.colors.bg.elements_bg}
            //   color={"yellow"}
            align="flex-start"
          >
            <Spacer position="left" size="extraLarge">
              <Text variant="raleway_bold_18" textAlign="center">
                Enter your names
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
              label="First Name"
              value={userToDB.first_name}
              onChangeText={(value) => {
                setUserToDB({
                  ...userToDB,
                  first_name: value,
                  display_name: value,
                });
              }}
              border_color={theme.colors.inputs.bottom_lines_disabled}
              underlineColor={theme.colors.inputs.bottom_lines_disabled}
              border_width={"0.3px"}
              activeUnderlineColor={theme.colors.ui.primary}
              keyboardType="default"
              autoCapitalize="words"
              autoCorrect={false}
              textContentType="givenName"
              autoComplete="name"
              returnKeyType="done"
              blurOnSubmit
            />
            <DataInput
              label="Last Name"
              value={userToDB.last_name}
              onChangeText={(value) => {
                setUserToDB({
                  ...userToDB,
                  last_name: value,
                });
              }}
              border_color={theme.colors.inputs.bottom_lines_disabled}
              underlineColor={theme.colors.inputs.bottom_lines_disabled}
              border_width={"0.3px"}
              activeUnderlineColor={theme.colors.ui.primary}
              keyboardType="default"
              autoCapitalize="words"
              autoCorrect={false}
              textContentType="familyName"
              autoComplete="name"
              returnKeyType="done"
              onFocus={() => setIsLastNameFocused(true)}
              onBlur={() => setIsLastNameFocused(false)}
              blurOnSubmit
            />
            <Spacer position="top" size="extraLarge" />
          </Container>
          <Spacer position="top" size="extraLarge" />
          <Container
            width="100%"
            // height="55%"
            color={theme.colors.bg.elements_bg}
            //   color={"yellow"}
            align="center"
            direction="row"
          >
            {isLastNameFocused && (
              <Regular_CTA
                width="55%"
                height={60}
                color={theme.colors.ui.primary}
                border_radius={"40px"}
                caption="Next"
                caption_text_variant="dm_sans_bold_20_white"
                // action={async () => navigation.navigate("Enter_Email_View")}
                action={async () =>
                  navigation.navigate("AuthModal", {
                    screen: "Enter_Email_View",
                    params: { returnTo },
                  })
                }
              />
            )}
          </Container>
        </Container>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
