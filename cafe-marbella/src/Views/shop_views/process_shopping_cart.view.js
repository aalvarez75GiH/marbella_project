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
  const { products } = cart;
  console.log("CART IN SHOPPING CART VIEW:", JSON.stringify(cart, null, 2));
  const image = cart.products[0].size_variants[0].images[0];

  const renderProductCartItemTile = ({ item }) => {
    return (
      <Spacer position="bottom" size="medium">
        <Product_Cart_Item_Tile image={image} item={item} />
      </Spacer>
    );
  };

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
          height="65%"
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
            // data={whole_bean_coffee}
            renderItem={renderProductCartItemTile}
            keyExtractor={(item, id) => {
              return item.id;
            }}
            gap={"15px"}
          />
          {/* <Product_Cart_Item_Tile image={image} /> */}
        </Container>
        <Spacer position="top" size="small" />
        <Container
          width="95%"
          height="10%"
          color={theme.colors.bg.elements_bg}
          // color={"lightgreen"}
          direction="row"
          border_radius="20px"
          overflow="hidden"
        >
          <Container
            width="50%"
            height="100%"
            // color="red"
            color={theme.colors.bg.elements_bg}
            justify="flex-start"
            align="flex-start"
          >
            <Spacer position="top" size="medium" />
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_20">Sub total:</Text>
            </Spacer>
          </Container>
          <Container
            width="50%"
            height="100%"
            // color="lightblue"
            justify="center"
            align="flex-end"
            color={theme.colors.bg.elements_bg}
          >
            <Spacer position="right" size="large">
              <Text variant="dm_sans_bold_20">$57.66</Text>
            </Spacer>
            <Spacer position="right" size="large">
              <Text
                variant="dm_sans_bold_14"
                style={{
                  color: "#7A7A7A",
                }}
              >
                (fees not included)
              </Text>
            </Spacer>
          </Container>
        </Container>
      </Container>
    </SafeArea>
  );
}
