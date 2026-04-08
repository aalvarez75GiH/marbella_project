import React, { useContext, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlatList } from "react-native";

import { Container } from "../../components/containers/general.containers";
import { theme } from "../../infrastructure/theme/index";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { Back_And_Add_Header } from "../../components/headers/back_and_add.header.js";
import { Warehouse_Tile } from "../../components/tiles/warehouse.tile.js";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context.js";

export default function Warehouses_View() {
  const navigation = useNavigation();
  const { warehouses } = useContext(WarehouseContext);
  //   console.log("WAREHOUSES:", warehouses);

  const renderingWarehousesFromBackendTile = ({ item }) => {
    const { warehouse_name, geo } = item;
    const { formatted_address } = geo || {};

    return (
      <Warehouse_Tile
        warehouse_name={warehouse_name}
        warehouse_address={formatted_address}
        item={item}
      />
    );
  };
  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Back_And_Add_Header
        action_1={() => navigation.goBack()}
        action_2={() =>
          //   navigation.navigate("Add_Warehouse_View", {
          navigation.navigate("Warehouse_Details_View", {
            coming_from: "add_cta",
          })
        }
        caption="Warehouses"
      />

      <Container
        width="100%"
        height="100%"
        justify="center"
        align="center"
        style={{ flex: 1 }}
        color={theme.colors.bg.elements_bg}
      >
        <FlatList
          data={warehouses}
          renderItem={renderingWarehousesFromBackendTile}
          keyExtractor={(item, index) =>
            String(item.warehouse_id ?? item?.warehouse_id ?? index)
          }
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Spacer position="top" size="medium" />}
          contentContainerStyle={{
            alignItems: "center", // 👈 THIS is the key
            paddingVertical: 16,
          }}
        />
      </Container>
    </SafeArea>
  );
}
