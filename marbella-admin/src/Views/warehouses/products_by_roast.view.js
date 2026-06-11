import React, { useContext, useState, useCallback } from "react";
import { ScrollView } from "react-native";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Roast_Type_Tile } from "../../components/tiles/roast_type.tile";
import { Icon_And_Caption_Footer } from "../../components/footers/icon_and_label.footer";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { Regular_UI_Title } from "../../components/uis_titles/regular_two_texts.title";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";

export default function Products_By_Roast_View() {
  const theme = useTheme();
  const { t } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();
  const route = useRoute();
  const { coming_from, grind_type } = route.params || {};
  console.log("coming from at filterProductsByRoast:", coming_from);

  const { setSelectedRoastType } = useContext(WarehouseContext);

  const [isLoading, setIsLoading] = useState(false);
  const [roastTypeSelected, setRoastTypeSelected] = useState("light");
  useFocusEffect(
    useCallback(() => {
      setIsLoading(false);
    }, [])
  );

  const filterProductsByRoast = (roastType) => {
    setIsLoading(true);
    setRoastTypeSelected(roastType);

    setTimeout(() => {
      try {
        setSelectedRoastType(roastType);

        navigation.navigate("Products_View", {
          coming_from,
          grind_type,
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
          <Global_activity_indicator
            caption={t("select_roast_type_view.activity_indicator")}
            caption_width="65%"
          />
        )}
        {!isLoading && (
          <>
            <Regular_UI_Title
              // main_title="Tap an option to select your roast type"
              main_title={t("select_roast_type_view.main_title")}
              // main_title="Select your preferred roast type"
              secondary_title={t("select_roast_type_view.secondary_title")}
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
                roast_caption={t(
                  "select_roast_type_view.roast_type_tiles.captions.light"
                )}
                roast_description={t(
                  "select_roast_type_view.roast_type_tiles.descriptions.light"
                )}
                action={() => filterProductsByRoast("light")}
                roastTypeSelected={roastTypeSelected}
              />
              <Spacer position="top" size="large" />
              <Roast_Type_Tile
                roast_type="medium"
                roast_caption={t(
                  "select_roast_type_view.roast_type_tiles.captions.medium"
                )}
                image_source={require("../../../assets/ilustrations/medium_roast.png")}
                // roast_caption="Medium Roast"
                roast_description={t(
                  "select_roast_type_view.roast_type_tiles.descriptions.medium"
                )}
                action={() => filterProductsByRoast("medium")}
                roastTypeSelected={roastTypeSelected}
              />
              <Spacer position="top" size="large" />
              <Roast_Type_Tile
                roast_type="dark"
                image_source={require("../../../assets/ilustrations/dark_roast_icon.png")}
                roast_caption={t(
                  "select_roast_type_view.roast_type_tiles.captions.dark"
                )}
                roast_description={t(
                  "select_roast_type_view.roast_type_tiles.descriptions.dark"
                )}
                action={() => filterProductsByRoast("dark")}
                roastTypeSelected={roastTypeSelected}
              />

              <Spacer position="top" size="medium" />
            </ScrollView>
            <Icon_And_Caption_Footer
              caption={t("select_roast_type_view.tap_footer")}
              image_source={require("../../../assets/my_icons/select.png")}
            />
          </>
        )}
      </Container>
    </SafeArea>
  );
}
