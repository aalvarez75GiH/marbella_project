import React from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { Container } from "../../components/containers/general.containers";
import { NewSafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Text } from "../../infrastructure/typography/text.component";
import { Menu_Sub_Title_Title } from "../../components/titles/menu_sub_titles.title";
import { Menu_Tile } from "../../components/tiles/menu_tiles.tile";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";
import { GlobalContext } from "../../infrastructure/services/global/global.context";

export default function Orders_Admin_View() {
  const theme = useTheme();
  const navigation = useNavigation();
  //   const tabBarHeight = useBottomTabBarHeight();

  return (
    <NewSafeArea
      background_color={theme.colors.bg.elements_bg}
      edges={["top", "left", "right"]}
      style={{ flex: 1 }}
    >
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
            <Text variant="raleway_bold_26">All orders tasks</Text>
          </Spacer>
        </Container>

        <Spacer position="top" size="small" />

        <ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        >
          <Menu_Sub_Title_Title label="Retrieve orders by" />
          <Menu_Tile
            caption="Scanning Customer's QR code"
            // action={() => navigation.navigate("Personal_Information_View")}
            // action={() => null}
            action={() => navigation.navigate("Customers_QR_Scanner_View")}
          />
          <Menu_Tile
            caption="Scanning Order's QR code"
            // action={() => navigation.navigate("Orders_View")}
            action={() => navigation.navigate("Merchant_Pickup_Scanner_View")}
          />

          {/* <Menu_Sub_Title_Title label="Credentials" />
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
              globalLanguage === "en" ? "Cambia a español" : "Change to english"
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
          <Menu_Tile caption="" action={() => null} disabled={true} /> */}
        </ScrollView>
      </Container>
    </NewSafeArea>
  );
}
