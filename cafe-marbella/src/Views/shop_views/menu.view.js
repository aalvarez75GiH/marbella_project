import React, { useLayoutEffect, useContext } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Text } from "../../infrastructure/typography/text.component";
import { Menu_Sub_Title_Title } from "../../components/titles/menu_sub_titles.title";
import { Menu_Tile } from "../../components/tiles/menu_tiles.tile";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";

export default function Menu_View() {
  const theme = useTheme();
  const navigation = useNavigation();

  const { user } = useContext(AuthenticationContext);
  const { first_name, last_name, email, display_name } = user || {};
  // Hiding tab bar for this screen
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      //background_color={"lightblue"}
      style={{ flex: 1 }}
    >
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
          <Menu_Sub_Title_Title label="Security" />
          <Menu_Tile caption="2-fa Auth" action={() => null} />
          <Menu_Tile caption="Face ID" action={() => null} />
          <Menu_Sub_Title_Title label="Help & Support" />
          <Menu_Tile caption="Help & Support" action={() => null} />
        </ScrollView>
      </Container>
    </SafeArea>
  );
}
