import React, { useContext } from "react";
import { Image, StyleSheet } from "react-native";
import { useTheme } from "styled-components/native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { Go_Back_Header_With_Label_And_Menu } from "../../components/headers/goBack_with_label_and_menu.header";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Product_Initial_Card } from "../../components/cards/product_initial_card/product_intial.card";
import { Text } from "../../infrastructure/typography/text.component";

import BeansIcon from "../../../assets/my_icons/beansicon.svg";
import IngredientsIcon from "../../../assets/my_icons/ingredientsIcon.svg";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";

export default function Product_Ingredients_View() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const { ingredients } = item || {};
  console.log(
    "Product Specifications View - item:",
    JSON.stringify(item, null, 2)
  );

  //   const { shopProductsGround, shopProductsWhole } =
  //     useContext(WarehouseContext);
  //   const data = shopProductsGround;

  const theme = useTheme();

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
        <Exit_Header_With_Label
          label=""
          orientation="right"
          action={() => navigation.goBack()}
        />
        <Container
          width="100%"
          height="3%"
          color={theme.colors.bg.elements_bg}
        />
        <Container
          width="100%"
          height="10%"
          color={theme.colors.bg.elements_bg}
          //   color={"green"}
          justify="center"
          align="flex-start"
          direction="row"
        >
          <Container
            width="80%"
            height="100%"
            color="transparent"
            align="flex-start"
          >
            <Spacer position="left" size="extraLarge">
              <Text variant="raleway_bold_20">Ingredients</Text>
            </Spacer>
          </Container>
          <Container
            width="20%"
            height="100%"
            color="transparent"
            padding_vertical="10%"
          >
            <Spacer position="right" size="large">
              <IngredientsIcon width={25} height={25} />
            </Spacer>
          </Container>
        </Container>
        <Spacer position="top" size="large" />
        <Container
          width="100%"
          //   color={theme.colors.bg.screens_bg}
          color="red"
          style={{ flex: 1 }}
          justify="flex-start"
        >
          <Container
            width="100%"
            height="70%"
            color={theme.colors.brand.secondary}
          >
            <Image
              source={require("../../../assets/ilustrations/ingredients_header_image.png")}
              style={styles.image_1}
            />
          </Container>
          <Container
            width="100%"
            height="30%"
            // color={theme.colors.brand.secondary}
            color={"green"}
            direction="row"
          >
            <Container
              width="20%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              //   color={"pink"}
            >
              <Spacer position="right" size="large">
                <BeansIcon width={25} height={25} />
              </Spacer>
            </Container>
            <Container
              width="80%"
              height="100%"
              color={theme.colors.bg.elements_bg}
              //   color={"ping"}
            >
              <Spacer position="left" size="large">
                <Text variant="raleway_medium_16">{ingredients}</Text>
              </Spacer>
            </Container>
          </Container>
        </Container>
      </Container>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  image_1: {
    width: "100%",
    height: "110%",
    resizeMode: "contain",
  },
  image_2: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
});
