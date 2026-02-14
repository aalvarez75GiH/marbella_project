import React, { useLayoutEffect, useContext } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Text } from "../../infrastructure/typography/text.component";
import { Menu_Sub_Title_Title } from "../../components/titles/menu_sub_titles.title";
import { Menu_Tile } from "../../components/tiles/menu_tiles.tile";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";
import { Regular_CTA } from "../../components/ctas/regular.cta";

export default function Menu_View() {
  const theme = useTheme();
  const navigation = useNavigation();

  const { user } = useContext(AuthenticationContext);
  const { first_name, last_name, email, display_name, user_id } = user || {};
  console.log("Menu_View user:", user);

  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: "none" } });

      return () => {
        parent?.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation])
  );

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      {user_id !== undefined ? (
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.screens_bg}
          // color={"green"}
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
            // color={"green"}
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
            // color={"green"}
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
          {/* <Spacer position="top" size="large" /> */}
          <ScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
          >
            <Menu_Sub_Title_Title label="Profile" />
            {/* ***************************************** */}
            <Menu_Tile caption="Personal info" action={() => null} />
            <Menu_Tile
              caption="Transactions history"
              action={() => navigation.navigate("Orders_View")}
            />
            <Menu_Tile caption="Account ID" action={() => null} />

            {/* ***************************************** */}
            <Menu_Sub_Title_Title label="Credentials" />
            <Menu_Tile caption="Get a new PIN" action={() => null} />
            <Menu_Tile
              caption="Switch to another account"
              action={() => navigation.navigate("Switching_Accounts_View")}
            />
            <Menu_Sub_Title_Title label="Help & Support" />
            <Menu_Tile caption="Help & Support" action={() => null} />
            <Menu_Tile
              caption="Sign out"
              action={() => navigation.navigate("Sign_Out_Overlay_View")}
            />
          </ScrollView>
        </Container>
      ) : (
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.screens_bg}
          // color={"green"}
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
            // color={"green"}
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
                caption="Sing in"
                caption_text_variant="dm_sans_bold_20_white"
                // action={() => null}
                action={() => {
                  navigation.navigate("AuthModal", {
                    screen: "Login_View",
                    params: {
                      returnTo: {
                        tab: "Shop", // or whatever tab this screen belongs to
                        screen: "Home_View", // the screen you want to land back on
                        params: {}, // optional
                      },
                    },
                  });
                }}
              />
            </Container>
          </Container>
        </Container>
      )}
    </SafeArea>
  );
}
