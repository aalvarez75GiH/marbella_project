import React, { useEffect, useContext } from "react";
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

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";
import { ScrollView } from "react-native-gesture-handler";
import { Switching_Accounts_Tile } from "../../components/tiles/switching_accounts.tile";

export default function Switching_Accounts_View() {
  const {
    otherUsersIntheDevice,
    emailToSwitch,
    setEmailToSwitch,
    isLoading,
    gettingUserByEmailToAuthenticated,
    user,
  } = useContext(AuthenticationContext);

  console.log("Current authenticated user in Switching Accounts View:", user);

  const navigation = useNavigation();
  const [userSwitched, setUserSwitched] = React.useState(false);
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [error, setError] = React.useState(null);

  const isValidEmail = (email = "") =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  //   const emailOk = isValidEmail(emailToSwitch);

  useEffect(() => {
    if (emailToSwitch?.trim().length === 0) {
      Keyboard.dismiss();
    }
  }, [emailToSwitch]);

  const renderingUsersAccounts = () => {
    const users = Array.isArray(otherUsersIntheDevice)
      ? otherUsersIntheDevice
      : [];

    return users.map((user, index) => {
      const { email, display_name } = user || {};
      return (
        <Spacer key={index} position="bottom" size="medium">
          <Switching_Accounts_Tile
            email={email}
            display_name={display_name}
            // action={() => test(email)}
            action={async () => {
              try {
                const userSwitched = await gettingUserByEmailToAuthenticated(
                  email
                );
                if (userSwitched?.ok) {
                  console.log("Successfully switched to user:", emailToSwitch);
                  setEmailToSwitch("");
                  setUserSwitched(true);
                  setEmailTouched(false); // optional: clear error state
                  return;
                }
                setUserSwitched(false);
                setError(
                  result?.message || "This user was not found. Sign up?"
                );
              } catch (error) {
                setUserSwitched(false);
                setError("This user was not found. Sign up?");
                console.log("Error switching user account:", error);
              }
            }}
            // action={async () => {
            //   try {
            //     const userSwitched = await gettingUserByEmailToAuthenticated(
            //       email
            //     );
            //     if (userSwitched?.ok) {
            //       console.log("Successfully switched to user:", email);
            //       setEmailToSwitch("");
            //       setUserSwitched(true);
            //     }
            //   } catch (error) {
            //     console.log("Error switching user account:", error);
            //   }
            // }}
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
      {!isLoading && userSwitched && (
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          justify="center"
          align="center"
        >
          <Text variant="dm_sans_bold_18"> User switched Successfully!!! </Text>
          <Spacer position="top" size="large"></Spacer>
          <Regular_CTA
            width="50%"
            height="8%"
            color={theme.colors.ui.primary}
            border_radius={"40px"}
            caption="Home"
            caption_text_variant="dm_sans_bold_20_white"
            action={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Home_View" }],
              })
            }
          />
        </Container>
      )}
      {!isLoading && error && (
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          justify="center"
          align="center"
        >
          <Text variant="dm_sans_bold_18"> {error} </Text>
          <Spacer position="top" size="large"></Spacer>
          <Regular_CTA
            width="50%"
            height="8%"
            color={theme.colors.ui.primary}
            border_radius={"40px"}
            caption="Sign Up"
            caption_text_variant="dm_sans_bold_20_white"
            action={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Home_View" }],
              })
            }
          />
        </Container>
      )}
      {!isLoading && !userSwitched && !error && (
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

            <Container
              width="100%"
              height="10%"
              color={theme.colors.bg.elements_bg}
              // color={"red"}
              align="flex-start"
            >
              {emailToSwitch?.trim().length === 0 && (
                <Spacer position="left" size="extraLarge">
                  <Text variant="dm_sans_bold_18">Other accounts found...</Text>
                </Spacer>
              )}
            </Container>
            {!Array.isArray(otherUsersIntheDevice) && !isLoading ? (
              <Text variant="dm_sans_medium_16">Loading accounts…</Text>
            ) : (
              <ScrollView style={{ flex: 1, width: "100%" }}>
                {!emailToSwitch?.length && (
                  <Container
                    width="100%"
                    padding_vertical={"5%"}
                    //   height="50%"
                    justify="flex-start"
                    color={theme.colors.bg.screens_bg}
                    align="center"
                    //   color={"green"}
                  >
                    {renderingUsersAccounts()}
                    {/* <Switching_Accounts_Tile /> */}
                  </Container>
                )}
              </ScrollView>
            )}
            {emailToSwitch?.trim().length > 0 && (
              <Regular_CTA
                width="95%"
                height="15%"
                color={theme.colors.ui.primary}
                border_radius={"40px"}
                caption="Switch Account"
                caption_text_variant="dm_sans_bold_20_white"
                action={async () => {
                  setEmailTouched(true);

                  const ok = isValidEmail(emailToSwitch);
                  if (!ok) return; // ✅ stops here, no request

                  try {
                    const result = await gettingUserByEmailToAuthenticated(
                      emailToSwitch.trim()
                    );
                    if (result?.ok) {
                      console.log(
                        "Successfully switched to user:",
                        emailToSwitch
                      );
                      setEmailToSwitch("");
                      setUserSwitched(true);
                      setEmailTouched(false); // optional: clear error state
                      return;
                    }
                    // ✅ show error from backend (not found / failed)
                    setUserSwitched(false);
                    setError(
                      result?.message || "This user was not found. Sign up?"
                    );
                  } catch (error) {
                    setUserSwitched(false);
                    setError("This user was not found. Sign up?");
                    console.log("Error switching user account:", error);
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
