import React, { useEffect, useContext, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { Keyboard } from "react-native";
import { useTranslation } from "react-i18next";

import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { DataInput } from "../../components/inputs/data_text_input";
import { theme } from "../../infrastructure/theme";
import { Container } from "../../components/containers/general.containers";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { EmailDataInput } from "../../components/inputs/email_data_input";

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
  const { t } = useTranslation();
  const emailInputRef = useRef(null);
  const { isValidEmail } = useContext(GlobalContext);
  const showOtherUsers = Boolean(isOtherUsers);
  console.log("isOtherUsers:", isOtherUsers);

  const { snackbar, showSnackbar, hideSnackbar } = useContext(GlobalContext);

  console.log("Current authenticated user in Switching Accounts View:", user);

  const navigation = useNavigation();
  const [isEmailFocused, setIsEmailFocused] = useState(false);
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
                  screen: "Shop_Products_View",
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
          caption={t("menu.switch_account_view.activity_indicator")}
          caption_width="65%"
          // color={"red"}
        />
      )}

      {!isLoading && !error && (
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
              <Spacer position="left" size="small">
                <Text variant="raleway_bold_18">
                  {t("menu.switch_account_view.title")}
                </Text>
              </Spacer>
            </Spacer>
          </Container>
          <EmailDataInput
            ref={emailInputRef}
            label={t("menu.switch_account_view.email_input_placeholder")}
            value={emailToSwitch}
            onChangeText={(value) => {
              setEmailToSwitch(value);
              if (isEmailFocused) setIsEmailFocused(false);
              if (error) setError(null);
            }}
            textInputOnPress={() => {
              setEmailToSwitch("");
              hideSnackbar();
              setTimeout(() => {
                emailInputRef.current?.focus();
              }, 50);
            }}
          />

          <Spacer position="top" size="medium" />
          <Spacer position="top" size="medium" />
          <Spacer position="top" size="medium" />
          <Spacer position="top" size="medium" />

          {emailToSwitch?.trim().length > 0 && isValidEmail(emailToSwitch) && (
            <Container
              width="100%"
              height="12%"
              align="flex-start"
              direction="row"
              justify="flex-start"
              color={theme.colors.bg.elements_bg}
            >
              <Container
                width="5%"
                height="100%"
                color={theme.colors.bg.elements_bg}
              />
              <Regular_CTA
                width="35%"
                height="55px"
                color={theme.colors.ui.primary}
                border_radius={"40px"}
                caption={t("menu.switch_account_view.cta")}
                caption_text_variant="dm_sans_bold_18_white"
                action={() => {
                  setIsEmailFocused(true);

                  const cleanEmail = emailToSwitch.trim();
                  const ok = isValidEmail(cleanEmail);

                  if (!ok) return;

                  navigation.navigate(
                    "Login_Screen_For_Switching_Accounts_View",
                    {
                      emailToSwitch: cleanEmail,
                      returnTo: {
                        tab: "Shop",
                        screen: "Shop_Products_View",
                      },
                    }
                  );

                  setEmailToSwitch("");
                }}
              />
            </Container>
          )}

          {showOtherUsers && emailToSwitch?.trim().length === 0 && (
            <Container
              width="100%"
              height="10%"
              color={theme.colors.bg.elements_bg}
              align="flex-start"
            >
              <Spacer position="left" size="extraLarge">
                <Text variant="dm_sans_bold_18">
                  {t("menu.switch_account_view.show_other_users_1_caption")}
                </Text>
              </Spacer>
            </Container>
          )}

          {showOtherUsers &&
            (!Array.isArray(otherUsersInTheDevice) && !isLoading ? (
              <Text variant="dm_sans_medium_16">
                {t("menu.switch_account_view.show_other_users_loading")}
              </Text>
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
        </Container>
      )}
    </SafeArea>
  );
}
