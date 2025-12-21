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

import { CartContext } from "../../infrastructure/services/cart/cart.context";

export default function Process_Shopping_Cart_View() {
  const theme = useTheme();
  // *************
  const { cart, isLoading, cartTotalItems } = useContext(CartContext);
  const products = cart?.products ?? [];
  const sub_total = cart?.sub_total ?? 0;

  // *************
  useEffect(() => {
    // ⬅️ when cart becomes empty, go back
    if (products.length === 0) {
      navigation.goBack();
    }
  }, [products.length]);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  const renderProductCartItemTile = ({ item }) => {
    const image = item?.size_variants?.[0]?.images?.[0]; // ✅ safe
    return (
      <Spacer position="bottom" size="medium">
        <Product_Cart_Item_Tile image={image} item={item} />
      </Spacer>
    );
  };

  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      {isLoading ? (
        <Global_activity_indicator
          caption="Wait, we are updating shopping cart..."
          caption_width="65%"
        />
      ) : (
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.screens_bg}
          // color={"green"}
          justify="flex-start"
          align="center"
        >
          <Go_Back_Header action={() => navigation.popToTop()} label="" />
          <Spacer position="top" size="small" />
          <Shopping_Cart_Title cartTotalItems={cartTotalItems} />
          <Spacer position="top" size="small" />
          <Container
            width="100%"
            height="55%"
            color={theme.colors.bg.elements_bg}
            // color={"green"}
            justify="center"
            align="center"
          >
            <Spacer position="top" size="medium" />

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
          </Container>
          <Spacer position="top" size="large" />
          <Shopping_Cart_Sub_Total_Footer sub_total={sub_total} />
          <Spacer position="top" size="medium" />
          <Regular_CTA
            width="95%"
            height="10%"
            color={theme.colors.ui.business}
            border_radius={"40px"}
            caption="Proceed to checkout"
            caption_text_variant="dm_sans_bold_20"
            action={() => null}
          />
        </Container>
      )}
    </SafeArea>
  );
}
