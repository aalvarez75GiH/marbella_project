import React, { useContext } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { Go_Back_Header_With_Label_And_Menu } from "../../components/headers/goBack_with_label_and_menu.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Product_Initial_Card } from "../../components/cards/product_initial_card/product_intial.card";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";

export default function Shop_View() {
  const navigation = useNavigation();

  const { shopProductsGround, shopProductsWhole } =
    useContext(WarehouseContext);
  //const data = shopProductsWhole;
  const data = shopProductsGround;

  const renderProductInitialCard = ({ item }) => {
    return (
      <Spacer position="bottom" size="medium">
        <Product_Initial_Card item={item} />
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
        <Go_Back_Header_With_Label_And_Menu
          action_1={() => null}
          action_2={() => navigation.navigate("Menu_View")}
          label="Whole bean coffee"
        />
        <Spacer position="top" size="large" />
        {/* <Product_Initial_Card /> */}
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderProductInitialCard}
          keyExtractor={(item, id) => {
            return item.id;
          }}
        />
      </Container>
    </SafeArea>
  );
}
