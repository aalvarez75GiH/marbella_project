import React, { useContext } from "react";
import { FlatList, Image } from "react-native";
import { useTheme } from "styled-components/native";

import {
  Action_Container,
  Container,
} from "../../components/containers/general.containers";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import RemoveIcon from "../../../assets/my_icons/remove_icon.svg";
import { Text } from "../../infrastructure/typography/text.component";

import { CartContext } from "../../infrastructure/services/cart/cart.context";

export const Product_Cart_Item_Tile = ({ item }) => {
  const theme = useTheme();
  const { increaseCartItemQty, decreaseCartItemQty, removingProductFromCart } =
    useContext(CartContext);
  console.log("ITEM IN CART TILE:", JSON.stringify(item, null, 2));
  const {
    cart_product_name,
    cart_product_country_name,
    cart_product_description,
    size_variants,
  } = item || {};
  const { sizeLabel, sizeLabel_ounces, price, images, quantity } =
    size_variants[0];
  const image = images[0];
  return (
    <>
      <Container
        // width="95%"
        width="390px"
        //height="70%"
        height="240px"
        // color="red"
        color={theme.colors.ui.secondary}
        direction="row"
        overflow="hidden"
        border_radius="20px"
      >
        <Container
          width="30%"
          height="100%"
          //color="blue"
          color={theme.colors.ui.secondary}
          // border_radius="20px"
        >
          <Image
            // source={images[item.image]}
            source={image}
            style={{
              width: "65%",
              height: "65%",
              resizeMode: "contain", // Ensures the image fits without distortion
            }}
          />
        </Container>
        <Container width="0.3%" height="80%" color={"#898989"} />
        <Container
          width="70%"
          height="100%"
          color="lightblue"
          justify="flex-start"
        >
          <Container
            width="100%"
            height="15%"
            color={theme.colors.ui.secondary}
            direction="row"
          >
            <Container
              width="80%"
              height="100%"
              // color="yellow"
              color={theme.colors.ui.secondary}
            ></Container>
            <Action_Container
              width="20%"
              height="100%"
              // color="orange"
              color={theme.colors.ui.secondary}
              justify="flex-end"
              align="center"
              onPress={() => removingProductFromCart(item)}
            >
              <RemoveIcon width={20} height={20} fill={"#FFFFFF"} />
            </Action_Container>
          </Container>
          <Container
            width="100%"
            height="40%"
            //color={theme.colors.ui.secondary}
            direction="row"
            color="purple"
          >
            <Container
              width="70%"
              height="100%"
              color={theme.colors.ui.secondary}
              //color={"yellow"}
              justify="center"
              align="flex-start"
            >
              <Spacer position="left" size="large">
                <Text variant="raleway_bold_14_white">{cart_product_name}</Text>
                <Text variant="raleway_bold_24_white">
                  {cart_product_country_name}
                </Text>
                <Text variant="raleway_bold_14_white">
                  {cart_product_description}
                </Text>
                <Text variant="raleway_bold_14_white">
                  {sizeLabel} - {sizeLabel_ounces}
                </Text>
              </Spacer>
            </Container>
            <Container
              width="30%"
              height="100%"
              color={theme.colors.ui.secondary}
              //color={"yellow"}
            ></Container>
          </Container>
          <Container
            width="100%"
            height="50%"
            //color="blue"
            direction="row"
            color={theme.colors.ui.secondary}
          >
            <Container
              width="50%"
              height="60%"
              color={theme.colors.ui.secondary}
              //color={"lightgreen"}
              justify="flex-start"
              align="center"
            >
              <Text
                variant="dm_sans_semiBold_32"
                style={{
                  color: theme.colors.ui.tertiary,
                }}
              >
                ${price}
              </Text>
            </Container>
            <Container
              width="50%"
              height="60%"
              // color={"blue"}
              direction="row"
            >
              <Container
                width="100%"
                height="100%"
                //color={"red"}
                direction="row"
                justify="space-evenly"
                color={theme.colors.ui.secondary}
              >
                <Action_Container
                  width="25px" // Set width and height to the same value
                  height="25px"
                  color={theme.colors.ui.secondary}
                  border_radius="25px" // Half of the width/height for a perfect circle
                  border_width="2px"
                  border_color={theme.colors.ui.white}
                  onPress={() => decreaseCartItemQty(item)}
                  justify="flex-start" // Center content vertically
                  align="center" // Center content horizontally
                >
                  <Text
                    variant="raleway_bold_14_white"
                    style={{
                      color: theme.colors.ui.tertiary,
                    }}
                  >
                    -
                  </Text>
                </Action_Container>
                <Text
                  variant="dm_sans_bold_16"
                  style={{
                    color: theme.colors.ui.tertiary,
                  }}
                >
                  {quantity}
                </Text>
                <Action_Container
                  width="25px"
                  height="25px"
                  color={theme.colors.ui.secondary}
                  border_radius="25px"
                  border_width="2px"
                  border_color={theme.colors.ui.white}
                  onPress={() => increaseCartItemQty(item)}
                  justify="center"
                  align="center"
                >
                  <Text
                    variant="raleway_bold_16_white"
                    style={{
                      color: theme.colors.ui.tertiary,
                    }}
                  >
                    +
                  </Text>
                </Action_Container>
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>
    </>
  );
};
