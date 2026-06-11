import React, { useContext } from "react";
import { ScrollView } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "styled-components/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import {
  Container,
  Action_Container,
} from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Grind_Type_Header } from "../../components/headers/grind_type.header";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";

export default function Products_By_grindType_View() {
  const theme = useTheme();
  const { t } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
  const CARD_HEIGHT = 290; // ✅ pick the height you want
  const route = useRoute();
  const { coming_from } = route.params || {};

  const {
    isLoading: whLoading,
    warehouseSelected,
    setSelectedGrindType,
    setSelectedRoastType,
  } = useContext(WarehouseContext);

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Container
        width="100%"
        color={theme.colors.bg.elements_bg}
        // color={"green"}
        justify="flex-start"
        align="center"
        style={{ flex: 1 }}
      >
        <Go_Back_Header label="" action={() => navigation.goBack()} />
        <Spacer position="top" size="large" />

        {warehouseSelected && (
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: theme.colors.bg.primary,
              width: "100%",
            }}
            contentContainerStyle={{
              alignItems: "center",
              paddingTop: 24,
              paddingBottom: tabBarHeight,
            }}
            showsVerticalScrollIndicator={false}
          >
            <Grind_Type_Header
              caption={t("headers.grind_type.caption.ground")}
            />
            <Spacer position="top" size="medium" />
            <Action_Container
              width="92%"
              style={{ height: CARD_HEIGHT }}
              color={theme.colors.bg.elements_bg}
              justify="flex-start"
              align="center"
              border_radius={"10px"}
              direction="row"
              overflow="hidden"
              onPress={() => {
                requestAnimationFrame(() => {
                  setSelectedGrindType("ground");
                  setSelectedRoastType(null);
                  navigation.navigate("Products_By_Roast_View", {
                    coming_from,
                    grind_type: "ground",
                  });
                  //   navigation.navigate("Products_By_Roast_View", {
                  //     coming_from: "ground_beans",
                  //   });
                });
              }}
            >
              <Container
                width="100%"
                height="100%"
                //color={theme.colors.bg.elements_bg}
                color={"#E7B672"}
                justify="center"
                align="center"
                border_radius_top_left={"0px"}
                border_radius_bottom_left={"0px"}
              >
                <Image
                  source={require("../../../assets/ilustrations/ground_products_banner.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  contentFit="cover" // replaces resizeMode
                  transition={300} // smooth fade-in
                />
              </Container>
            </Action_Container>
            <Spacer position="top" size="medium" />
            <Grind_Type_Header
              caption={t("headers.grind_type.caption.whole")}
            />

            <Spacer position="top" size="medium" />
            <Action_Container
              width="92%"
              style={{ height: CARD_HEIGHT }}
              // color={"green"}
              color={theme.colors.bg.elements_bg}
              justify="flex-start"
              align="center"
              border_radius={"10px"}
              direction="row"
              overflow="hidden"
              onPress={() => {
                requestAnimationFrame(() => {
                  setSelectedGrindType("whole");
                  setSelectedRoastType(null);
                  navigation.navigate("Products_By_Roast_View", {
                    coming_from,
                    grind_type: "whole",
                  });
                  //   navigation.navigate("Products_By_Roast_View", {
                  //     coming_from: "whole_beans",
                  //   });
                });
              }}
            >
              <Container
                width="100%"
                height="100%"
                // color={"#D86A6D"}
                color={"transparent"}
                justify="center"
                align="center"
                border_radius_top_left={"0px"}
                border_radius_bottom_left={"0px"}
                overflow="hidden"
              >
                <Image
                  source={require("../../../assets/ilustrations/whole_products_banner.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 10,
                  }}
                  contentFit="cover" // replaces resizeMode
                  transition={300} // smooth fade-in
                />
              </Container>
            </Action_Container>
            <Spacer position="top" size="medium" />
          </ScrollView>
        )}
      </Container>
    </SafeArea>
  );
}
