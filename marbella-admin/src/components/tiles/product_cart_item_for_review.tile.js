import React, { useContext } from "react";
import { Image } from "react-native";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

import { Container } from "../../components/containers/general.containers";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";

import { GlobalContext } from "../../infrastructure/services/global/global.context";

export const Product_Cart_Item_For_Review_Tile = ({ product, image }) => {
  const theme = useTheme();

  console.log("IMAGE:", image);
  const imageSource = typeof image === "string" ? { uri: image } : image;

  const { size_variants } = product || {};
  const { sizeLabel, sizeLabel_ounces, price, quantity } = size_variants[0];

  const { formatCentsToUSD } = useContext(GlobalContext);
  const price_formatted = formatCentsToUSD(price);

  const { title, product_name, product_subtitle } = product || {};

  const cartTitle = product.title; // "Cafe Marbella"
  const cartCountry = product.originCountry;
  const cartDesc =
    product.grindType === "whole" ? "Whole bean coffee" : "Ground bean coffee";

  return (
    <>
      <Container
        width="390px"
        height="240px"
        color={theme.colors.ui.secondary}
        direction="row"
        overflow="hidden"
        border_radius="20px"
      >
        <Container width="30%" height="100%" color={theme.colors.ui.secondary}>
          <Image
            // source={images[item.image]}
            source={imageSource}
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
                <Text variant="raleway_bold_14_white">{cartTitle}</Text>
                <Text variant="raleway_bold_24_white">{cartCountry}</Text>
                <Text variant="raleway_bold_14_white">{cartDesc}</Text>
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
            direction="column"
            align="flex-start"
            color={theme.colors.ui.secondary}
          >
            <Container
              width="45%"
              height="45%"
              color={theme.colors.ui.secondary}
              //color={"lightgreen"}
              justify="center"
              align="center"
            >
              <Text
                variant="dm_sans_semiBold_32"
                style={{
                  color: theme.colors.ui.tertiary,
                }}
              >
                {price ? price_formatted : "0.00"}
              </Text>
            </Container>
            <Container
              width="100%"
              height="40%"
              color={"blue"}
              direction="row"
              justify="flex-start"
            >
              <Container
                width="100%"
                height="100%"
                //color={"red"}
                direction="row"
                justify="flex-end"
                align="flex-start"
                color={theme.colors.ui.secondary}
              >
                <Spacer position="right" size="extraLarge">
                  <Text
                    variant="dm_sans_bold_16"
                    style={{
                      color: theme.colors.ui.tertiary,
                    }}
                  >
                    Qty: {""}
                    {quantity}
                  </Text>
                </Spacer>
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>
    </>
  );
};
