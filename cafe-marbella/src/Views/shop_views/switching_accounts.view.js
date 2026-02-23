import React, { useEffect, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, Keyboard } from "react-native";

import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { DataInput } from "../../components/inputs/data_text_input";
import { theme } from "../../infrastructure/theme";
import { Container } from "../../components/containers/general.containers";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { ScrollView } from "react-native-gesture-handler";
import { Switching_Accounts_Tile } from "../../components/tiles/switching_accounts.tile";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";
import { GlobalContext } from "../../infrastructure/services/global/global.context";

export default function Switching_Accounts_View() {
  const {
    otherUsersInTheDevice,
    isOtherUsers,
    emailToSwitch,
    setEmailToSwitch,
    isLoading,
    user,
  } = useContext(AuthenticationContext);
  const { isValidEmail } = useContext(GlobalContext);
  const showOtherUsers = Boolean(isOtherUsers);
  console.log("isOtherUsers:", isOtherUsers);

  console.log("Current authenticated user in Switching Accounts View:", user);

  const navigation = useNavigation();
  const [emailTouched, setEmailTouched] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (emailToSwitch?.trim().length === 0) {
      Keyboard.dismiss();
    }
  }, [emailToSwitch]);

  const renderingUsersAccounts = () => {
    const users = Array.isArray(otherUsersInTheDevice)
      ? otherUsersInTheDevice
      : [];

    return users.map((user, index) => {
      const { email, display_name } = user || {};
      return (
        <Spacer key={index} position="bottom" size="medium">
          <Switching_Accounts_Tile
            email={email}
            display_name={display_name}
            // action={() => test(email)}
            action={async () =>
              navigation.navigate("Login_Screen_For_Switching_Accounts_View", {
                emailToSwitch: email,
                returnTo: {
                  tab: "Shop",
                  screen: "Home_View",
                  // params: { coming_from: "Home_View" },
                },
              })
            }
          />
        </Spacer>
      );
    });
  };

  return (
    <SafeArea background_color="#FFFFFF">
      {isLoading && (
        <Global_activity_indicator
          caption="Wait, we are switching to another account..."
          caption_width="65%"
          // color={"red"}
        />
      )}

      {!isLoading && !error && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // tweak if needed
        >
          <Container
            width="100%"
            height="100%"
            color={theme.colors.bg.elements_bg}
            justify="flex-start"
            align="center"
          >
            <Go_Back_Header label="" action={() => navigation.goBack()} />
            <Spacer position="top" size="large" />
            <Container
              width="100%"
              height="10%"
              color={theme.colors.bg.elements_bg}
              justify="center"
              align="flex-start"
            >
              <Spacer position="left" size="large">
                <Text variant="raleway_bold_18">Switch to another account</Text>
              </Spacer>
            </Container>
            <DataInput
              label="Enter email address to switch"
              value={emailToSwitch}
              onChangeText={(value) => {
                setEmailToSwitch(value);
                if (emailTouched) setEmailTouched(false);
                if (error) setError(null);
              }}
              underlineColor={theme.colors.inputs.bottom_lines}
              activeUnderlineColor="#3A2F01"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              autoComplete="email"
              returnKeyType="done"
              blurOnSubmit
            />

            {emailTouched &&
              emailToSwitch.trim().length > 0 &&
              !isValidEmail(emailToSwitch) && (
                <Container
                  width="100%"
                  height="10%"
                  color={theme.colors.bg.elements_bg}
                  justify="flex-start"
                  align="flex-start"
                >
                  <Spacer position="top" size="large" />
                  <Spacer position="left" size="large">
                    <Text variant="dm_sans_bold_14" style={{ color: "red" }}>
                      Please enter a valid email address
                    </Text>
                  </Spacer>
                </Container>
              )}

            <Spacer position="top" size="medium" />
            <Spacer position="top" size="medium" />
            <Spacer position="top" size="medium" />
            <Spacer position="top" size="medium" />

            {showOtherUsers && emailToSwitch?.trim().length === 0 && (
              <Container
                width="100%"
                height="10%"
                color={theme.colors.bg.elements_bg}
                align="flex-start"
              >
                <Spacer position="left" size="extraLarge">
                  <Text variant="dm_sans_bold_18">
                    Other accounts in this device (tap to switch)
                  </Text>
                </Spacer>
              </Container>
            )}

            {showOtherUsers &&
              (!Array.isArray(otherUsersInTheDevice) && !isLoading ? (
                <Text variant="dm_sans_medium_16">Loading accounts…</Text>
              ) : (
                <ScrollView style={{ flex: 1, width: "100%" }}>
                  {!emailToSwitch?.length && (
                    <Container
                      width="100%"
                      padding_vertical={"5%"}
                      justify="flex-start"
                      color={theme.colors.bg.screens_bg}
                      align="center"
                    >
                      {renderingUsersAccounts()}
                    </Container>
                  )}
                </ScrollView>
              ))}

            {emailToSwitch?.trim().length > 0 && (
              <Regular_CTA
                width="95%"
                height="15%"
                color={theme.colors.ui.primary}
                border_radius={"40px"}
                caption="Switch Account"
                caption_text_variant="dm_sans_bold_20_white"
                action={() => {
                  setEmailTouched(true);
                  const ok = isValidEmail(emailToSwitch);

                  if (!ok) return; // ✅ stops here, no request
                  if (ok) {
                    setEmailToSwitch("");
                    navigation.navigate(
                      "Login_Screen_For_Switching_Accounts_View",
                      {
                        emailToSwitch: emailToSwitch.trim(),
                        returnTo: {
                          tab: "Shop",
                          screen: "Home_View",
                        },
                      }
                    );
                  }
                }}
              />
            )}
          </Container>
        </KeyboardAvoidingView>
      )}
    </SafeArea>
  );
}
