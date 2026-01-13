import React, { useContext, useCallback } from "react";
import { FlatList, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

import { useTheme } from "styled-components/native";
import { Container } from "../../components/containers/general.containers";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Just_Caption_Header } from "../../components/headers/just_caption.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { useEffect } from "react";
import { Text } from "../../infrastructure/typography/text.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { My_Orders_Tile } from "../../components/tiles/my_orders.tile.js";
import Empty_My_Orders_View from "./empty_my_orders.view.js";

import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";

export default function Orders_View() {
  const { orders, gettingAllOrdersByUserID, isLoading } =
    useContext(OrdersContext);
  console.log("ORDERS AT VIEW :", JSON.stringify(orders, null, 2));

  const { user } = useContext(AuthenticationContext);
  const { user_id } = user || {};
  const { formatDate } = useContext(GlobalContext);
  const theme = useTheme();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      console.log("Orders screen fetch fired. user_id:", user_id);
      if (!user_id) return;
      gettingAllOrdersByUserID(user_id);
    }, [user_id])
  );

  const renderingOrdersFromBackendTile = ({ item }) => {
    console.log(
      "ORDER ITEM IN RENDERING FUNCTION :",
      JSON.stringify(item, null, 2)
    );
    const {
      pricing,
      warehouse_to_pickup,
      order_status,
      createdAt,
      delivery_type,
      customer,
      order_number,
    } = item;
    const { name, warehouse_address } = warehouse_to_pickup;
    const { total } = pricing;
    const { customer_address } = customer;

    return (
      <My_Orders_Tile
        warehouse_name={name}
        warehouse_address={warehouse_address}
        order_status={order_status}
        total={total}
        long_formatted_date={formatDate(createdAt).long}
        short_formatted_date={formatDate(createdAt).short}
        delivery_type={delivery_type}
        customer_address={customer_address}
        order_number={order_number}
      />
    );
  };
  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.screens_bg}
        // color={"red"}
        justify="flex-start"
        align="center"
      >
        <Just_Caption_Header caption="My Orders" />
        <Spacer position="top" size="small" />

        {isLoading && (
          <Global_activity_indicator
            caption="Wait, we are loading your orders..."
            caption_width="65%"
            color={theme.colors.bg.elements_bg}
          />
        )}
        {!isLoading && orders.length === 0 && <Empty_My_Orders_View />}
        {!isLoading && orders.length > 0 && (
          <>
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
          </>
        )}
      </Container>
    </SafeArea>
  );
}
