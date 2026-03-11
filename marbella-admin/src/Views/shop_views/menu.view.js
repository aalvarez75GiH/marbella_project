import React, { useContext } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { NewSafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Text } from "../../infrastructure/typography/text.component";
import { Menu_Sub_Title_Title } from "../../components/titles/menu_sub_titles.title";
import { Menu_Tile } from "../../components/tiles/menu_tiles.tile";
import { Switch_Language_Tile } from "../../components/tiles/switch_language.tile";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";
import { GlobalContext } from "../../infrastructure/services/global/global.context";

export default function Menu_View() {
  const theme = useTheme();
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();

  const { user, otherUsersInTheDevice } = useContext(AuthenticationContext);
  const { email, display_name, user_id, customer_qr } = user || {};
  const { customer_token } = customer_qr || {};
  // console.log("Menu_View user:", user);

  // Check if there are other users in the device in order to use it as a
  //condition to enable or disable the "Switch to another account" option in the menu

  const { globalLanguage, togglingGlobalLanguage, isLoading } =
    useContext(GlobalContext);

  return (
    <NewSafeArea
      background_color={theme.colors.bg.elements_bg}
      edges={["top", "left", "right"]}
      style={{ flex: 1 }}
    >
      {isLoading ? (
        <Global_activity_indicator
          caption={
            globalLanguage === "en"
              ? "Cambiando a español..."
              : "Changing to english..."
          }
        />
      ) : user_id !== undefined ? (
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          justify="flex-start"
          align="center"
          // style={{ paddingBottom: tabBarHeight }}
        >
          <Exit_Header_With_Label
            label=""
            action={() => navigation.goBack()}
            orientation="right"
          />
          <Container
            width="100%"
            height="10%"
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="extraLarge">
              <Text variant="raleway_bold_26">Account</Text>
            </Spacer>
          </Container>

          <Spacer position="top" size="small" />
          <Container
            width="100%"
            height="15%"
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="extraLarge">
              <Text variant="raleway_bold_24">{display_name}</Text>
            </Spacer>
            <Spacer position="top" size="small" />
            <Spacer position="left" size="extraLarge">
              <Text variant="raleway_medium_16">{email}</Text>
            </Spacer>
          </Container>

          <ScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
          >
            <Menu_Sub_Title_Title label="Profile" />
            <Menu_Tile
              caption="Personal info"
              action={() => navigation.navigate("Personal_Information_View")}
            />
            <Menu_Tile
              caption="Transactions history"
              action={() => navigation.navigate("Orders_View")}
            />
            <Menu_Tile
              caption="Your QR code"
              action={() =>
                navigation.navigate("Customer_QR_View", {
                  customer_token,
                  size: 300,
                })
              }
              // disabled={true}
            />

            <Menu_Sub_Title_Title label="Credentials" />
            <Menu_Tile
              caption="Get a new PIN"
              action={() => navigation.navigate("Reset_PIN_View")}
            />
            <Menu_Tile
              caption="Switch to another account"
              action={() => navigation.navigate("Switching_Accounts_View")}
            />

            <Menu_Sub_Title_Title label="Help & Support" />
            <Switch_Language_Tile
              caption={
                globalLanguage === "en"
                  ? "Cambia a español"
                  : "Change to english"
              }
              action={() => togglingGlobalLanguage()}
            />
            <Menu_Tile
              caption="Help & Support"
              action={() => null}
              disabled={true}
            />
            <Menu_Tile
              caption="Sign out"
              action={() => navigation.navigate("Sign_Out_Overlay_View")}
            />
            <Menu_Tile caption="" action={() => null} disabled={true} />
          </ScrollView>
        </Container>
      ) : (
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.screens_bg}
          justify="flex-start"
          align="center"
        >
          <Exit_Header_With_Label
            label=""
            action={() => navigation.goBack()}
            orientation="right"
          />
          <Container
            width="100%"
            height="10%"
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="extraLarge">
              <Text variant="raleway_bold_26">Sign in or Sign up </Text>
            </Spacer>
          </Container>
          <Spacer position="top" size="small" />
          <Container />
          <Container
            width="100%"
            height="80%"
            color={theme.colors.bg.elements_bg}
            justify="flex-start"
            align="flex-start"
          >
            <Spacer position="top" size="extraLarge" />
            <Container
              width="100%"
              height="10%"
              color={theme.colors.bg.elements_bg}
              justify="center"
              align="flex-start"
              padding_horizontal="5%"
            >
              <Regular_CTA
                width={"55%"}
                height={60}
                color={theme.colors.ui.black}
                border_radius={"40px"}
                caption="Sign in"
                caption_text_variant="dm_sans_bold_20_white"
                action={() => {
                  navigation.navigate("AuthModal", {
                    screen: "Login_View",
                    params: {
                      returnTo: {
                        tab: "Shop",
                        screen: "Shop_Products_View",
                        params: {},
                      },
                    },
                  });
                }}
              />
            </Container>
          </Container>
        </Container>
      )}
    </NewSafeArea>
  );
}
