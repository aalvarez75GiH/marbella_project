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
import { Splitter_Component } from "../../components/others/grey_splitter.component";
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
          <Splitter_Component width="95%" height="0.3%" color={"#EBEBEB"} />
          <Menu_Tile
            caption="Scanning Customer's QR code"
            // action={() => navigation.navigate("Personal_Information_View")}
            // action={() => null}
            action={() => navigation.navigate("Customers_QR_Scanner_View")}
          />

          <Splitter_Component width="95%" height="0.3%" color={"#EBEBEB"} />

          <Menu_Tile
            caption="Scanning Order's QR code"
            // action={() => navigation.navigate("Orders_View")}
            action={() => navigation.navigate("Merchant_Pickup_Scanner_View")}
          />
          <Splitter_Component width="95%" height="0.3%" color={"#EBEBEB"} />
          <Menu_Tile
            caption="Customer's email"
            // action={() => navigation.navigate("Orders_View")}
            action={() => navigation.navigate("Admin_Enter_Email_View")}
          />
          <Splitter_Component width="95%" height="0.3%" color={"#EBEBEB"} />
        </ScrollView>
      </Container>
    </NewSafeArea>
  );
}
