import React, { useContext, useMemo } from "react";
import { SectionList, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header_With_Label_And_Menu } from "../../components/headers/goBack_with_label_and_menu.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Product_Initial_Card } from "../../components/cards/product_initial_card/product_intial.card";
import { Text } from "../../infrastructure/typography/text.component";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";

export default function Shop_View() {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const route = useRoute();
  const { coming_from } = route.params || {};
  const { productsChosenForShop } = useContext(WarehouseContext);
  const theme = useTheme();

  const sections = useMemo(() => {
    if (!Array.isArray(productsChosenForShop)) return [];

    const grouped = productsChosenForShop.reduce((acc, product) => {
      const country =
        product?.country || product?.originCountry || "Other origins";

      if (!acc[country]) {
        acc[country] = [];
      }

      acc[country].push(product);
      return acc;
    }, {});

    return Object.entries(grouped).map(([title, data]) => ({
      title,
      data,
    }));
  }, [productsChosenForShop]);

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Container
        width="100%"
        height="100%"
        // color={theme.colors.bg.elements_bg}
        color={theme.colors.bg.screens_bg}
        // color={"red"}
        justify="flex-start"
        align="center"
        style={{ paddingBottom: 50 }}
      >
        <Go_Back_Header_With_Label_And_Menu
          action_1={() => navigation.goBack()}
          action_2={() => navigation.navigate("Menu_View")}
          label={
            coming_from === "whole_beans"
              ? "Whole beans coffee"
              : "Ground beans coffee"
          }
        />

        <Spacer position="top" size="large" />
        <SectionList
          sections={sections}
          stickySectionHeadersEnabled={false}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 20,
                backgroundColor: theme.colors.bg.screens_bg,
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "flex-start",
            width: "100%",
            paddingBottom: 24,
            flexGrow: 1,
            backgroundColor: theme.colors.bg.elements_bg,
          }}
          renderSectionHeader={({ section }) => (
            <Container
              width="100%"
              padding_vertical="12px"
              margin_top="16px"
              margin_bottom="12px"
              color={theme.colors.bg.elements_bg}
              justify="flex-start"
              align="flex-start"
            >
              <Spacer position="left" size="large">
                <Text variant="dm_sans_bold_20">{section.title}</Text>
              </Spacer>
            </Container>
          )}
          renderItem={({ item }) => <Product_Initial_Card item={item} />}
        />
        <Spacer position="top" size="large" />
      </Container>
    </SafeArea>
  );
}
