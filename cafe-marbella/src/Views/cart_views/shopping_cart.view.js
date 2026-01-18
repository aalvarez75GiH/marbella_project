import React, { useContext, useCallback } from "react";
import { FlatList } from "react-native";
import { useTheme } from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import {
  Action_Container,
  Container,
} from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Shopping_Cart_Title } from "../../components/titles/shopping_cart.title";
import { Product_Cart_Item_Tile } from "../../components/tiles/product_cart_item.tile";
import { Shopping_Cart_Sub_Total_Footer } from "../../components/footers/shopping_cart_sub_total.footer";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import Empty_Shopping_Cart_View from "./empty_shopping_cart.view";
import { Just_Caption_Header } from "../../components/headers/just_caption.header.js";

import { CartContext } from "../../infrastructure/services/cart/cart.context";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
export default function Shopping_Cart_View() {
  const theme = useTheme();
  const { setMyOrder } = useContext(OrdersContext);
  // *************
  const { user } = useContext(AuthenticationContext);
  const { user_id, first_name, last_name, email, phone_number, uid, address } =
    user || {};
  const { cart, isLoading, cartTotalItems, gettingCartByUserID } =
    useContext(CartContext);
  const products = cart?.products ?? [];
  const sub_total = cart?.sub_total ?? 0;

  useFocusEffect(
    useCallback(() => {
      console.log("Cart screen fetch fired. user_id:", user_id);
      if (!user_id) return;
      gettingCartByUserID(user_id);
      // gettingAllOrdersByUserID(user_id);
    }, [user_id])
  );

  const navigation = useNavigation();

  const renderProductCartItemTile = ({ item }) => {
    const image = item?.size_variants?.[0]?.images?.[0]; // ✅ safe
    return (
      <Spacer position="bottom" size="medium">
        <Product_Cart_Item_Tile image={image} product={item} />
      </Spacer>
    );
  };

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Container
        style={{ flex: 1 }}
        width="100%"
        color={theme.colors.bg.elements_bg}
      >
        {/* Divider */}
        <Container
          style={{
            width: "100%",
            height: 1, // ✅ fixed height, not %
            backgroundColor: theme.colors.bg.screens_bg,
            marginTop: 2,
          }}
        />

        {isLoading && (
          <Global_activity_indicator
            caption="Wait, we are updating shopping cart..."
            caption_width="65%"
            color={theme.colors.bg.elements_bg}
          />
        )}

        {!isLoading && products.length === 0 && <Empty_Shopping_Cart_View />}

        {!isLoading && products.length > 0 && (
          <>
            <Just_Caption_Header caption="My Cart" />
            <Container
              style={{ flex: 1 }} // ✅ THIS fills remaining SafeArea
              width="100%"
              // height="80%"
              color={theme.colors.bg.screens_bg}
              justify="center"
              align="center"
            >
              <Spacer position="top" size="small" />
              <Shopping_Cart_Title cartTotalItems={cartTotalItems} />
              <Spacer position="top" size="small" />

              {/* List should flex, not % height */}
              <FlatList
                style={{ flex: 1 }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={products}
                renderItem={renderProductCartItemTile}
                keyExtractor={(item, id) => {
                  return item.id;
                }}
                gap={"15px"}
              />

              <Shopping_Cart_Sub_Total_Footer sub_total={sub_total} />
              <Spacer position="top" size="medium" />
              <Regular_CTA
                width="95%"
                height={70} // ✅ fixed height instead of %
                color={theme.colors.ui.business}
                border_radius="40px"
                caption="Proceed to checkout"
                caption_text_variant="dm_sans_bold_20"
                // action={() => navigation.navigate("Shop_Delivery_Type_View")}
                action={() => {
                  setMyOrder((prevOrder) => {
                    return {
                      ...prevOrder,
                      customer: {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        phone_number: phone_number,
                        customer_address: address,
                        uid: uid,
                      },
                      order_status: "In Progress",
                    };
                  });
                  navigation.navigate("Shop_Delivery_Type_View", {
                    coming_from: "Shopping_Cart_View",
                  });
                }}
              />
            </Container>
          </>
        )}
      </Container>
    </SafeArea>
  );
}
