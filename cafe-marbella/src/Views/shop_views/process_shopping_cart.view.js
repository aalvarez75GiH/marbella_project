import React, { useContext } from "react";
import { FlatList, Image } from "react-native";
import { useTheme } from "styled-components/native";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Shopping_Cart_Title } from "../../components/titles/shopping_cart.title";
import RemoveIcon from "../../../assets/my_icons/remove_icon.svg";
import { Text } from "../../infrastructure/typography/text.component";

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
          {/* ***************** SHOPPING CART PRODUCT TILE ********************* */}
          <Container
            width="95%"
            height="60%"
            // color="red"
            color={theme.colors.ui.secondary}
            direction="row"
            overflow="hidden"
            border_radius="20px"
          >
            <Container
              width="35%"
              height="100%"
              // color="blue"
              // border_radius="20px"
              color={theme.colors.ui.secondary}
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
              width="65%"
              height="100%"
              color="lightblue"
              justify="flex-start"
            >
              <Container
                width="100%"
                height="15%"
                color="green"
                direction="row"
              >
                <Container
                  width="80%"
                  height="100%"
                  // color="yellow"
                  color={theme.colors.ui.secondary}
                ></Container>
                <Container
                  width="20%"
                  height="100%"
                  // color="orange"
                  color={theme.colors.ui.secondary}
                >
                  <RemoveIcon width={20} height={20} fill={"#FFFFFF"} />
                </Container>
              </Container>
              <Container
                width="100%"
                height="55%"
                color={theme.colors.ui.secondary}
                direction="row"
              >
                <Container
                  width="70%"
                  height="100%"
                  color={theme.colors.ui.secondary}
                  justify="center"
                  align="flex-start"
                >
                  <Spacer position="left" size="large">
                    <Text variant="raleway_bold_14_white">Cafe Marbella</Text>
                    <Text variant="raleway_bold_24_white">Venezuela</Text>
                    <Text variant="raleway_bold_14_white">
                      Ground bean coffee
                    </Text>
                    <Text variant="raleway_bold_14_white">250 gr - 8 oz</Text>
                  </Spacer>
                </Container>
                <Container
                  width="30%"
                  height="100%"
                  color={theme.colors.ui.secondary}
                  // color={"yellow"}
                ></Container>
              </Container>
              <Container
                width="100%"
                height="30%"
                // color="red"
                color={theme.colors.ui.secondary}
              ></Container>
            </Container>
            {/* ***************** SHOPPING CART PRODUCT TILE ********************* */}
          </Container>
        </Container>
      </Container>
    </SafeArea>
  );
}
