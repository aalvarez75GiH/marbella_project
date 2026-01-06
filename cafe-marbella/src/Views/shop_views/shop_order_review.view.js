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

import { CartContext } from "../../infrastructure/services/cart/cart.context";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { GlobalContext } from "../../infrastructure/services/global/global.context";

export default function Shop_Order_Review_View() {
  const theme = useTheme();
  const { formatCentsToUSD } = useContext(GlobalContext);
  const formatted_currency = formatCentsToUSD;
  // *************
  const { myOrder, isLoading } = useContext(OrdersContext);
  console.log(
    "myOrder in Shop_Order_Review_View:",
    JSON.stringify(myOrder, null, 2)
  );
  const { pricing } = myOrder || {};
  const { sub_total, shipping, taxes, discount, total } = pricing || {};
  const navigation = useNavigation();

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
          </Container>
        </>
      )}
    </SafeArea>
  );
}
