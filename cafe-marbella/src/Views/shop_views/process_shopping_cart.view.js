import React, { useContext } from "react";
import { FlatList, Image } from "react-native";
import { useTheme } from "styled-components/native";

import {
  Action_Container,
  Container,
} from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Shopping_Cart_Title } from "../../components/titles/shopping_cart.title";
import RemoveIcon from "../../../assets/my_icons/remove_icon.svg";
import { Text } from "../../infrastructure/typography/text.component";
import { Product_Cart_Item_Tile } from "../../components/tiles/product_cart_item.tile";

import { CartContext } from "../../infrastructure/services/cart/cart.context";

export default function Process_Shopping_Cart_View() {
  const theme = useTheme();
  const { cart } = useContext(CartContext);
  console.log("CART IN SHOPPING CART VIEW:", JSON.stringify(cart, null, 2));
  const image = cart.products[0].size_variants[0].images[0];
  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.screens_bg}
        // color={"green"}
        justify="flex-start"
        align="center"
      >
        <Go_Back_Header action={() => null} label="" />
        <Spacer position="top" size="small" />
        <Shopping_Cart_Title />
        <Spacer position="top" size="small" />
        <Container
          width="100%"
          height="50%"
          color={theme.colors.bg.elements_bg}
          // color={"green"}
          justify="flex-start"
          align="center"
        >
          <Product_Cart_Item_Tile image={image} />
        </Container>
      </Container>
    </SafeArea>
  );
}
