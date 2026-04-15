import React, { useMemo } from "react";
import { SectionList } from "react-native";
import { View } from "react-native";
import { List } from "react-native-paper";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { Product_Inventory_Edit_Card } from "../cards/products_inventory.card";

export const Inventory_Accordion = ({
  groundProducts = [],
  wholeProducts = [],
  onChangeVariantQty = null,
}) => {
  const tabBarHeight = useBottomTabBarHeight();
  const buildSectionsByCountry = (products = []) => {
    const grouped = products.reduce((acc, product) => {
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
  };

  const groundSections = useMemo(
    () => buildSectionsByCountry(groundProducts),
    [groundProducts]
  );

  console.log("GROUND SECTIONS:", JSON.stringify(groundSections, null, 2));

  const wholeSections = useMemo(
    () => buildSectionsByCountry(wholeProducts),
    [wholeProducts]
  );

  const renderProduct = ({ item }) => (
    <Product_Inventory_Edit_Card
      product={item}
      onChangeVariantQty={onChangeVariantQty}
    />
  );

  const renderSectionHeader = ({ section }) => (
    <View
      style={{
        width: "100%",
        paddingVertical: 8,
        paddingHorizontal: 4,
        backgroundColor: "#FFFFFF",
      }}
    >
      <List.Subheader
        style={{
          color: "#000000",
          fontSize: 15,
          fontWeight: "700",
          paddingHorizontal: 0,
        }}
      >
        {section.title}
      </List.Subheader>
    </View>
  );

  return (
    <View style={{ width: "100%" }}>
      <List.AccordionGroup>
        <List.Accordion
          id="ground"
          title={`Ground bean coffee (${groundProducts.length})`}
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            // paddingBottom: tabBarHeight,
          }}
          titleStyle={{
            color: "#000000",
            fontSize: 16,
          }}
        >
          <View style={{ padding: 12 }}>
            <SectionList
              sections={groundSections}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={renderProduct}
              renderSectionHeader={renderSectionHeader}
              stickySectionHeadersEnabled={true}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              style={{ maxHeight: 500 }}
              contentContainerStyle={{ paddingBottom: tabBarHeight }}
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          </View>
        </List.Accordion>

        <List.Accordion
          id="whole"
          title={`Whole bean coffee (${wholeProducts.length})`}
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
          }}
          titleStyle={{
            color: "#000000",
            fontSize: 16,
          }}
        >
          <View style={{ padding: 12 }}>
            <SectionList
              sections={wholeSections}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={renderProduct}
              renderSectionHeader={renderSectionHeader}
              stickySectionHeadersEnabled={true}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              style={{ maxHeight: 500 }}
              contentContainerStyle={{ paddingBottom: tabBarHeight }}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          </View>
        </List.Accordion>
      </List.AccordionGroup>
    </View>
  );
};
