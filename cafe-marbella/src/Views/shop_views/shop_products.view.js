import React, { useContext, useState, useCallback } from "react";
import { Image, ScrollView, InteractionManager } from "react-native";
import { useTheme } from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import {
  Container,
  Action_Container,
} from "../../components/containers/general.containers";
import { Go_Back_Header_With_Label_And_Menu } from "../../components/headers/goBack_with_label_and_menu.header";
import { Main_Header } from "../../components/headers/main.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Product_Initial_Card } from "../../components/cards/product_initial_card/product_intial.card";
import { Text } from "../../infrastructure/typography/text.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";
export default function Shop_Products_View() {
  const theme = useTheme();
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
          label="Our premium coffee"
          //   hide_icon={true}
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
            // style={{ flex: 1, width: "100%" }}
            style={{
              flex: 1,
              backgroundColor: theme.colors.bg.primary,
              width: "100%",
            }}
            contentContainerStyle={{
              alignItems: "center",
              paddingTop: 24,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            <Action_Container
              width="90%"
              // height="40%"
              style={{ height: CARD_HEIGHT }}
              //color={theme.colors.bg.elements_bg}
              color={"green"}
              justify="flex-start"
              align="center"
              border_radius_top_left={"10px"}
              border_radius_bottom_left={"10px"}
              direction="row"
              overflow="hidden"
              onPress={() => {
                setIsLoading(true);

                // setTimeout(async () => {
                setProductsChosenForShop(shopProductsWhole);
                navigation.navigate("Home_View");
                // }, 200);
              }}
            >
              <Container
                width="65%"
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
                  source={require("../../../assets/ilustrations/whole_beans_products.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "content", // Ensures the image fits without distortion
                  }}
                />
              </Container>
              <Container
                width="35%"
                height="100%"
                color={"#D86A6D"}
                justify="center"
                align="center"
                border_radius_top_left={"0px"}
                border_radius_bottom_left={"0px"}
                overflow="hidden"
              >
                <Text variant="raleway_bold_16_white" textAlign="center">
                  Premium
                </Text>
                <Text variant="raleway_bold_16_white" textAlign="center">
                  Whole bean
                </Text>
                <Text variant="raleway_bold_16_white" textAlign="center">
                  coffee
                </Text>
              </Container>
            </Action_Container>
            <Spacer position="top" size="medium" />
            <Action_Container
              width="90%"
              style={{ height: CARD_HEIGHT }}
              color={theme.colors.bg.elements_bg}
              // color={"red"}
              justify="flex-start"
              align="center"
              border_radius_top_right={"10px"}
              border_radius_bottom_right={"10px"}
              direction="row"
              overflow="hidden"
              onPress={() => {
                setIsLoading(true);

                // setTimeout(async () => {
                setProductsChosenForShop(shopProductsGround);
                navigation.navigate("Home_View");
                // }, 0);
              }}
            >
              <Container
                width="35%"
                height="100%"
                //color={theme.colors.bg.elements_bg}
                color={"#E7B672"}
                justify="center"
                align="center"
                border_radius_top_left={"0px"}
                border_radius_bottom_left={"0px"}
              >
                <Text variant="raleway_bold_16" textAlign="center">
                  Premium
                </Text>
                <Text variant="raleway_bold_16" textAlign="center">
                  Ground bean
                </Text>
                <Text variant="raleway_bold_16" textAlign="center">
                  coffee
                </Text>
              </Container>
              <Container
                width="65%"
                height="100%"
                //color={theme.colors.bg.elements_bg}
                color={"lightblue"}
                justify="flex-start"
                align="center"
                border_radius_top_right={"10px"}
                border_radius_bottom_right={"10px"}
              >
                <Image
                  source={require("../../../assets/ilustrations/ground_beans_poster.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "content", // Ensures the image fits without distortion
                  }}
                />
              </Container>
            </Action_Container>
            {/* <Action_Container
              width="90%"
              // height="40%"
              padding_vertical="10%"
              //color={theme.colors.bg.elements_bg}
              color={"green"}
              justify="flex-start"
              align="center"
              direction="row"
              overflow="hidden"
              onPress={() => null}
            ></Action_Container> */}
          </ScrollView>
        )}
      </Container>
    </SafeArea>
  );
}
