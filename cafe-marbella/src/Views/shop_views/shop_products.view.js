import React, { useContext } from "react";
import { FlatList, Image } from "react-native";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

import {
  Container,
  Action_Container,
} from "../../components/containers/general.containers";
import { Go_Back_Header_With_Label_And_Menu } from "../../components/headers/goBack_with_label_and_menu.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Product_Initial_Card } from "../../components/cards/product_initial_card/product_intial.card";
import { Text } from "../../infrastructure/typography/text.component";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";

export default function Shop_Products_View() {
  const {
    shopProductsGround,
    shopProductsWhole,
    productsChosenForShop,
    setProductsChosenForShop,
  } = useContext(WarehouseContext);
  //const data = shopProductsWhole;
  const data = shopProductsGround;

  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
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
        <Go_Back_Header_With_Label_And_Menu
          action_1={() => null}
          action_2={() => navigation.navigate("Menu_View")}
          label="Our premium coffee"
          hide_icon={true}
        />
        <Spacer position="top" size="large" />
        <Action_Container
          width="90%"
          height="40%"
          //color={theme.colors.bg.elements_bg}
          color={"green"}
          justify="flex-start"
          align="center"
          border_radius_top_left={"10px"}
          border_radius_bottom_left={"10px"}
          direction="row"
          overflow="hidden"
          onPress={() => {
            setProductsChosenForShop(shopProductsWhole);
            navigation.navigate("Home_View", {
              products: shopProductsWhole,
            });
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
            //color={theme.colors.bg.elements_bg}
            // color={theme.colors.brand.tertiary}
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
          height="40%"
          //color={theme.colors.bg.elements_bg}
          color={"red"}
          justify="flex-start"
          align="center"
          border_radius_top_right={"10px"}
          border_radius_bottom_right={"10px"}
          direction="row"
          overflow="hidden"
          onPress={() => {
            setProductsChosenForShop(shopProductsGround);
            navigation.navigate("Home_View", {
              products: shopProductsWhole,
            });
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
      </Container>
    </SafeArea>
  );
}
