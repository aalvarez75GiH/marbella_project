import React, { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, FlatList, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "styled-components/native";
import { fonts, fontWeights } from "../../infrastructure/theme/fonts";
import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { useEffect } from "react";
import { Text } from "../../infrastructure/typography/text.component";
import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import DeliveryIcon from "../../../assets/my_icons/deliveryTruckIcon.svg";
import { Order_From_Backend_Tile } from "../../components/tiles/order.tile.js";

import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { Regular_CTA } from "../../components/ctas/regular.cta";

export default function Orders_View() {
  useEffect(() => {
    gettingAllOrdersByUserID("aaa09d45-24a9-4a3f-aca5-9658952172c2");
  }, []);
  const { orders, gettingAllOrdersByUserID } = useContext(OrdersContext);
  console.log("ORDERS AT VIEW :", JSON.stringify(orders, null, 2));

  const theme = useTheme();
  const navigation = useNavigation();

  const renderingOrdersFromBackendTile = ({ item }) => {
    console.log(
      "ORDER ITEM IN RENDERING FUNCTION :",
      JSON.stringify(item, null, 2)
    );
    const { pricing, warehouse_to_pickup, order_status } = item;
    const { name, address } = warehouse_to_pickup;
    const { total } = pricing;

    return (
      <Order_From_Backend_Tile
        sub_total={item.sub_total}
        warehouse_name={name}
        warehouse_address={address}
        order_status={order_status}
        shipping={item.shipping}
        taxes={item.taxes}
        discount={item.discount}
        total={total}
        quantity={item.quantity}
      />
    );
  };
  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        // color={"red"}
        justify="flex-start"
        align="center"
      >
        <Exit_Header_With_Label
          // action={() => navigation.popToTop()}
          action={() => null}
          label="My Orders"
        />
        <Spacer position="top" size="large" />
        {/* <Order_From_Backend_Tile /> */}

        <FlatList
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
            paddingBottom: 24,
            flexGrow: 1,
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={orders}
          renderItem={renderingOrdersFromBackendTile}
          keyExtractor={(item, id) => item.order_id}
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />} // Adjust the height to control the gap
        />
      </Container>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
