import React, { useContext, useLayoutEffect, useEffect } from "react";
import { FlatList } from "react-native";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";

import {
  Action_Container,
  Container,
} from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Product_Cart_Item_Tile } from "../../components/tiles/product_cart_item.tile";
import { Order_Info_Tile } from "../../components/tiles/order_info.tile";
import { RT_Delivery_Information_Order_Tile } from "../../components/tiles/rt_delivery_information_order_tile";
import { Splitter_Component } from "../../components/others/grey_splitter.component";
import { Payment_method_Info_Tile } from "../../components/tiles/payment_method_used_info.tile";
import { Refunded_Information_Order_Tile } from "../../components/tiles/refunded_information_order.tile";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";
import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";

export default function Order_View() {
  const theme = useTheme();
  const route = useRoute();
  const { item } = route.params;
  console.log("ORDER ITEM AT ORDER VIEW :", JSON.stringify(item, null, 2));

  //   const { myWarehouse } = useContext(WarehouseContext);
  //   const { distance_in_miles } = myWarehouse || {};
  const {
    pricing,
    warehouse_to_pickup,
    order_products,
    delivery_type,
    payment_information,
    quantity,
    order_status,
    updatedAt,
    refund_details = "Refunded",
    order_number,
    order_delivery_address,
  } = item || {};
  const { sub_total, shipping, taxes, discount, total } = pricing || {};
  const { last_four } = payment_information || {};
  const {
    warehouse_name,
    warehouse_address,
    closing_time,
    opening_time,
    distance_in_miles,
    geo,
  } = warehouse_to_pickup || {};
  const { lat, lng } = geo || {};

  const navigation = useNavigation();

  const renderingOrderProducts = () => {
    return order_products.map((item) => {
      const variantId = item?.size_variants?.[0]?.id ?? "no-variant";
      const key = `${item.id}:${variantId}`;

      return (
        <Spacer position="bottom" size="medium" key={key}>
          <Product_Cart_Item_Tile
            image={item?.size_variants?.[0]?.images?.[0]}
            product={item}
          />
        </Spacer>
      );
    });
  };
  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      <>
        <Go_Back_Header
          action={() => navigation.goBack()}
          label="Order information"
        />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: theme.colors.bg.elements_bg,
            paddingBottom: 20, // Prevents last items from being cut off
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Container
            width="100%"
            align="center"
            justify="flex-start"
            style={{ flex: 1 }} // Ensures dynamic height adjustment
            color={theme.colors.bg.elements_bg}
            //   color={theme.colors.bg.screens_bg}
          >
            <Spacer position="top" size="small" />
            <Splitter_Component
              width="100%"
              height="5px"
              color={theme.colors.bg.screens_bg}
            />
            <Order_Info_Tile
              sub_total={sub_total}
              shipping={shipping}
              taxes={taxes}
              discount={discount}
              total={total}
              quantity={quantity}
            />
            <Splitter_Component
              width="100%"
              height="5px"
              color={theme.colors.bg.screens_bg}
            />
            <Spacer position="top" size="medium" />

            <Container
              width="100%"
              color={theme.colors.bg.elements_bg}
              justify="center"
              align="flex-start"
              padding_vertical="10px"
            >
              <Spacer position="left" size="large">
                <Text variant="dm_sans_bold_20" style={{ marginLeft: 16 }}>
                  Shipment details
                </Text>
              </Spacer>
            </Container>
            {order_status !== "Refunded" ? (
              <RT_Delivery_Information_Order_Tile
                warehouse_name={warehouse_name}
                warehouse_address={warehouse_address}
                opening_time={opening_time}
                closing_time={closing_time}
                distance_to_warehouse_mi={distance_in_miles}
                delivery_type={delivery_type}
                order_delivery_address={order_delivery_address}
                warehouse_lat={lat}
                warehouse_lng={lng}
              />
            ) : (
              <Refunded_Information_Order_Tile
                warehouse_name={warehouse_name}
                warehouse_address={warehouse_address}
                opening_time={opening_time}
                closing_time={closing_time}
                distance_to_warehouse_mi={distance_in_miles}
                delivery_type={delivery_type}
                customer_address={customer_address}
                warehouse_lat={lat}
                warehouse_lng={lng}
                order_number={order_number}
                updatedAt={updatedAt}
                refund_details={refund_details}
              />
            )}
            <Spacer position="top" size="large" />
            <Payment_method_Info_Tile last_four={last_four} />

            <Spacer position="top" size="large" />
            <Container
              width="100%"
              align="flex-start"
              color={theme.colors.bg.elements_bg}
            >
              <Spacer position="top" size="large" />
              <Spacer position="left" size="large">
                <Text variant="dm_sans_bold_20">Products in the order</Text>
              </Spacer>
            </Container>
            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />
            <Container
              width="100%"
              height="auto"
              color={theme.colors.bg.elements_bg}
              // color={"red"}
            >
              {renderingOrderProducts()}
            </Container>
          </Container>
        </ScrollView>
      </>
    </SafeArea>
  );
}
