import React, { useContext, useState, useCallback } from "react";
import { ScrollView } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import {
  Container,
  Action_Container,
} from "../../components/containers/general.containers";
import { Main_Header } from "../../components/headers/main.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Grind_Type_Header } from "../../components/headers/grind_type.header";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";

export default function Shop_Products_View() {
  const theme = useTheme();
  const { t } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
  const CARD_HEIGHT = 290; // ✅ pick the height you want

  const {
    myWarehouse,
    isLoading: whLoading,
    shopProductsGround,
    shopProductsWhole,
    setProductsChosenForShop,
  } = useContext(WarehouseContext);
  const ready = !!myWarehouse; // or also require productsCatalog if needed

  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(false);
    }, [])
  );

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
        <Main_Header
          action_1={() => null}
          action_2={() => navigation.navigate("Menu_View")}
          label={t("headers.main.title")}
          subTitle={t("headers.main.subtitle")}
          // label="Explore coffee"
        />
        <Spacer position="top" size="large" />
        {(!ready || whLoading || isLoading) && (
          <Global_activity_indicator
            caption="Loading products..."
            caption_width="65%"
          />
        )}
        {ready && !whLoading && !isLoading && (
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
                setIsLoading(true);

                requestAnimationFrame(() => {
                  setProductsChosenForShop(shopProductsGround);

                  navigation.navigate("Select_Roast_Type_View", {
                    coming_from: "ground_beans",
                  });
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
                setIsLoading(true);
                requestAnimationFrame(() => {
                  setProductsChosenForShop(shopProductsWhole);

                  navigation.navigate("Select_Roast_Type_View", {
                    coming_from: "whole_beans",
                  });
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
            {/* <Container
              width="92%"
              padding_vertical="4%"
              color={theme.colors.bg.screens_bg}
              justify="flex-start"
              align="center"
              direction="row"
              overflow="hidden"
            >
              <Spacer position="left" size="large">
                <Text variant="raleway_bold_18">Green</Text>
              </Spacer>
            </Container> */}
            {/* <Spacer position="top" size="medium" />
            <Action_Container
              width="92%"
              style={{ height: CARD_HEIGHT }}
              color={theme.colors.bg.elements_bg}
              // color={"green"}
              justify="flex-start"
              align="center"
              border_radius={"10px"}
              direction="row"
              overflow="hidden"
              onPress={() => null}
            >
              <Container
                width="100%"
                height="100%"
                //color={theme.colors.bg.elements_bg}
                color={"lightblue"}
                justify="flex-start"
                align="center"
                border_radius_top_left={"10px"}
                border_radius_bottom_left={"10px"}
                overflow="hidden"
              >
                <Image
                  source={require("../../../assets/ilustrations/green_products_banner.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    // resizeMode: "content", // Ensures the image fits without distortion
                  }}
                  contentFit="cover" // replaces resizeMode
                  transition={300} // smooth fade-in
                />
              </Container>
            </Action_Container> */}
          </ScrollView>
        )}
      </Container>
    </SafeArea>
  );
}
