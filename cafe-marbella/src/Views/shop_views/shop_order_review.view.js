import React, { useContext, useLayoutEffect, useEffect } from "react";
import { FlatList } from "react-native";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

import {
  Action_Container,
  Container,
} from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Shopping_Cart_Title } from "../../components/titles/shopping_cart.title";
import { Text } from "../../infrastructure/typography/text.component";
import { Product_Cart_Item_Tile } from "../../components/tiles/product_cart_item.tile";
import { Shopping_Cart_Sub_Total_Footer } from "../../components/footers/shopping_cart_sub_total.footer";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Order_Info_Tile } from "../../components/tiles/order_info.tile";
import { Delivery_type_Badge } from "../../components/others/delivery_type.badge";
import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import { Delivery_Information_Order_Tile } from "../../components/tiles/delivery_information_order.tile";

import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";

export default function Shop_Order_Review_View() {
  const theme = useTheme();
  const { myOrder, isLoading } = useContext(OrdersContext);
  console.log(
    "myOrder in Shop_Order_Review_View:",
    JSON.stringify(myOrder, null, 2)
  );
  const { myWarehouse } = useContext(WarehouseContext);
  const { distance_in_miles } = myWarehouse || {};
  const { pricing, warehouse_to_pickup } = myOrder || {};
  const { sub_total, shipping, taxes, discount, total } = pricing || {};
  const {
    name: warehouse_name,
    address: warehouse_address,
    closing_time,
    opening_time,
  } = warehouse_to_pickup || {};

  const navigation = useNavigation();
  let delivery_type = "pickup";
  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      {isLoading ? (
        <Global_activity_indicator
          caption="Wait, we are updating shopping cart..."
          caption_width="65%"
        />
      ) : (
        <>
          <Container
            width="100%"
            height="100%"
            color={theme.colors.bg.screens_bg}
            //   color={"green"}
            justify="flex-start"
            align="center"
          >
            <Go_Back_Header
              action={() => navigation.popToTop()}
              label="Order review"
            />
            <Spacer position="top" size="small" />
            <Order_Info_Tile
              sub_total={sub_total}
              shipping={shipping}
              taxes={taxes}
              discount={discount}
              total={total}
            />
            <Spacer position="top" size="small" />

            {delivery_type === "pickup" ? (
              <Delivery_type_Badge
                caption_text_variant="dm_sans_bold_14"
                caption="Free Pickup"
                type="pickup"
              />
            ) : (
              <Delivery_type_Badge
                caption_text_1_variant="dm_sans_bold_16"
                caption_text_2_variant="dm_sans_bold_14"
                //   caption_1={`Delivery +Fees ${formatted_currency(shipping)}`}
                caption_1="Delivery"
                caption_2="for just $5"
                type="delivery"
              />
            )}
            {/* ********************************** */}
            <Delivery_Information_Order_Tile
              warehouse_name={warehouse_name}
              warehouse_address={warehouse_address}
              opening_time={opening_time}
              closing_time={closing_time}
              distance_to_warehouse_mi={distance_in_miles}
            />

            {/* ********************************** */}
          </Container>
        </>
      )}
    </SafeArea>
  );
}
