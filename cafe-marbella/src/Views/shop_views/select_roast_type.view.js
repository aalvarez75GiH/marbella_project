import React, { useContext, useState, useCallback } from "react";
import { ScrollView } from "react-native";
import { useTheme } from "styled-components/native";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Go_Back_Header_With_Label_And_Menu } from "../../components/headers/goBack_with_label_and_menu.header";
import { Roast_Type_Tile } from "../../components/tiles/roast_type.tile";
import { Text } from "../../infrastructure/typography/text.component";
import { Icon_And_Caption_Footer } from "../../components/footers/icon_and_label.footer";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { Regular_UI_Title } from "../../components/uis_titles/regular_two_texts.title";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";

export default function Select_Roast_Type_View() {
  const theme = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
  const route = useRoute();
  const { coming_from } = route.params || {};

  const {
    isLoading: whLoading,
    productsChosenForShop,
    setProductsChosenForShop,
    shopProductsGround,
    shopProductsWhole,
  } = useContext(WarehouseContext);

  const [isLoading, setIsLoading] = useState(false);
  const [roastTypeSelected, setRoastTypeSelected] = useState("light");

  useFocusEffect(
    useCallback(() => {
      setIsLoading(false);
    }, [])
  );

  const filterProductsByRoast = (roastType, coming_from) => {
    setIsLoading(true);
    setRoastTypeSelected(roastType);
    setTimeout(() => {
      try {
        const baseProducts =
          coming_from === "ground_beans"
            ? shopProductsGround
            : shopProductsWhole;
        const filteredProducts = baseProducts.filter(
          (product) => product?.roast?.toLowerCase() === roastType.toLowerCase()
        );

        setProductsChosenForShop(filteredProducts);

        navigation.navigate("Home_View", {
          coming_from:
            coming_from === "ground_beans" ? "ground_beans" : "whole_beans",
        });
      } catch (error) {
        console.error("Error filtering products by roast type:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Container
        width="100%"
        color={theme.colors.bg.screens_bg}
        // color={"green"}
        justify="flex-start"
        align="center"
        style={{ flex: 1 }}
      >
        <Go_Back_Header action={() => navigation.goBack()} label="" />
        <Spacer position="top" size="large" />

        {isLoading && (
          <Global_activity_indicator caption="Wait..." caption_width="65%" />
        )}
        {!isLoading && (
          <>
            <Regular_UI_Title
              main_title="Tap an option to select your roast type"
              // main_title="Select your preferred roast type"
              secondary_title="Each roast bring out unique flavors and aromas"
            />

            <ScrollView
              style={{
                flex: 1,
                backgroundColor: theme.colors.bg.primary,
                width: "100%",
              }}
              contentContainerStyle={{
                alignItems: "center",
                paddingTop: 24,
                paddingBottom: tabBarHeight + 24,
              }}
              showsVerticalScrollIndicator={false}
            >
              <Roast_Type_Tile
                roast_type="light"
                image_source={require("../../../assets/ilustrations/light_roast_icon.png")}
                roast_caption="Light Roast"
                roast_description={
                  "Light roasted with the best cutting edge machinery"
                }
                action={() => filterProductsByRoast("light", coming_from)}
                roastTypeSelected={roastTypeSelected}
              />
              <Spacer position="top" size="large" />
              <Roast_Type_Tile
                roast_type="medium"
                image_source={require("../../../assets/ilustrations/medium_roast.png")}
                roast_caption="Medium Roast"
                roast_description={
                  "Medium roasted with the best cutting edge machinery"
                }
                action={() => filterProductsByRoast("medium", coming_from)}
                roastTypeSelected={roastTypeSelected}
              />
              <Spacer position="top" size="large" />
              <Roast_Type_Tile
                roast_type="dark"
                image_source={require("../../../assets/ilustrations/dark_roast_icon.png")}
                roast_caption="Dark Roast"
                roast_description={
                  "Dark roasted with the best cutting edge machinery"
                }
                action={() => filterProductsByRoast("dark", coming_from)}
                roastTypeSelected={roastTypeSelected}
              />

              <Spacer position="top" size="medium" />
            </ScrollView>
            <Icon_And_Caption_Footer
              caption={"Tap a roast to see available coffees"}
              image_source={require("../../../assets/my_icons/select.png")}
            />
          </>
        )}
      </Container>
    </SafeArea>
  );
}
