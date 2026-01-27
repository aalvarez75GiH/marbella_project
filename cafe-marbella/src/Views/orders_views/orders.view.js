import React, { useContext, useCallback } from "react";
import { FlatList, View, SectionList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

import { useTheme } from "styled-components/native";
import { Container } from "../../components/containers/general.containers";
import { Just_Caption_Header } from "../../components/headers/just_caption.header.js";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
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
  const {
    orders,
    isLoading,
    ordersGrouped,
    gettingAllOrdersByUserIDGroupedByMonth,
  } = useContext(OrdersContext);
  const navigation = useNavigation();

  console.log("ORDERS VIEW RERENDERED", JSON.stringify(orders, null, 2));

  const { user } = useContext(AuthenticationContext);
  const { user_id } = user || {};
  const { formatDate } = useContext(GlobalContext);
  const theme = useTheme();

  const sections =
    (ordersGrouped || []).map((group) => ({
      title: group.label, // "November, 2025"
      data: group.orders || [], // array of orders for that month
      monthKey: group.monthKey,
    })) || [];

  const route = useRoute();
  const refresh = route.params?.refresh;
  useFocusEffect(
    useCallback(() => {
      if (!user_id) return;
      gettingAllOrdersByUserIDGroupedByMonth(user_id);
    }, [user_id, refresh])
  );

  const renderingOrdersFromBackendTile = ({ item }) => {
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
        order_number={order_number}
        item={item}
      />
    );
  };
  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Container
        width="100%"
        style={{ flex: 1 }}
        color={theme.colors.bg.elements_bg}
        //color={"red"}
        justify="flex-start"
        align="center"
      >
        <Exit_Header_With_Label
          label="My Orders"
          action={() => navigation.goBack()}
        />
        <View
          style={{
            width: "100%",
            height: "0.5%",
            backgroundColor: theme.colors.bg.screens_bg,

            marginTop: 2,
            alignSelf: "stretch",
          }}
        />
        <Spacer position="top" size="small" />

        {isLoading && (
          <Global_activity_indicator
            caption="Wait, we are loading your orders..."
            caption_width="65%"
            color={theme.colors.bg.elements_bg}
          />
        )}
        {!isLoading && sections.length === 0 && <Empty_My_Orders_View />}

        {!isLoading && sections.length > 0 && (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.order_id}
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
                margin_top="16px"
                margin_bottom="8px"
                // padding_horizontal="16px"
                color={theme.colors.bg.screens_bg}
              >
                <Text variant="dm_sans_bold_16">{section.title}</Text>
              </Container>
            )}
            renderItem={({ item }) => renderingOrdersFromBackendTile({ item })}
            ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          />
        )}
      </Container>
    </SafeArea>
  );
}
