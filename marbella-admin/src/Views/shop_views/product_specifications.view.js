import React, { useContext } from "react";
import { StyleSheet, FlatList } from "react-native";
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
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";

export default function Product_Specifications_View() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const { specifications } = item || {};
  console.log(
    "Product Specifications View - item:",
    JSON.stringify(item, null, 2)
  );

  //   const { shopProductsGround, shopProductsWhole } =
  //     useContext(WarehouseContext);
  //   const data = shopProductsGround;

  const renderSpecsTile = ({ item }) => {
    const { caption, title } = item || {};
    return (
      <Spacer position="bottom" size="small">
        <Container
          width="100%"
          padding_vertical={"7%"}
          //   height="12%"
          color={theme.colors.bg.elements_bg}
          direction="row"
        >
          <Container
            width="35%"
            // height="100%"
            // color="yellow"
            color={theme.colors.bg.elements_bg}
            align="flex-start"
            padding_vertical={"2%"}
          >
            <Spacer position="left" size="large">
              <Text variant="raleway_bold_16">{title}:</Text>
            </Spacer>
          </Container>
          <Container
            width="65%"
            // height="100%"
            align="flex-start"
            //color="blue"
            color={theme.colors.bg.elements_bg}
          >
            <Spacer position="left" size="large">
              <Text variant="raleway_medium_16">{caption}</Text>
            </Spacer>
          </Container>
        </Container>
        {/* ********************* */}
      </Spacer>
    );
  };

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
              <Text variant="raleway_bold_20">Specifications</Text>
            </Spacer>
          </Container>
          <Container width="20%" height="100%" color="transparent">
            <Spacer position="right" size="large">
              <BeansIcon width={25} height={25} />
            </Spacer>
          </Container>
        </Container>
        <Container
          width="100%"
          color={theme.colors.bg.screens_bg}
          //color="red"
          style={{ flex: 1 }}
        >
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={specifications}
            renderItem={renderSpecsTile}
            keyExtractor={(item, id) => {
              return item.spec_id;
            }}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 14 }}
          />
        </Container>
      </Container>
    </SafeArea>
  );
}
