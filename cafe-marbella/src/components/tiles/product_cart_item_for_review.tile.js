import React, { useContext } from "react";
import { Image } from "expo-image";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";
import { Platform, Dimensions } from "react-native";

import { Container } from "../../components/containers/general.containers";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";

import { CartContext } from "../../infrastructure/services/cart/cart.context";
import { GlobalContext } from "../../infrastructure/services/global/global.context";

export const Product_Cart_Item_For_Review_Tile = ({ product, image }) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const { width } = Dimensions.get("window");
  const TILE_WIDTH = width * 0.92;
  const TILE_HEIGHT = TILE_WIDTH * 0.58;
  const IMAGE_WIDTH = TILE_WIDTH * 0.26;

  const imageSource = typeof image === "string" ? { uri: image } : image;

  const { size_variants } = product || {};
  const { sizeLabel, sizeLabel_ounces, price, quantity } = size_variants[0];

  const { formatCentsToUSD, getTranslatedField } = useContext(GlobalContext);
  const price_formatted = formatCentsToUSD(price);

  const { title, product_name, product_subtitle } = product || {};
  console.log("PRODUCT SUBTITLE:", product_subtitle);

  const productNameTranslated = getTranslatedField(product_name, lang);
  const productSubtitleTranslated = getTranslatedField(product_subtitle, lang);
  console.log("PRODUCT SUBTITLE TRANSLATED:", productSubtitleTranslated);

  return (
    <>
      <Container
        width={TILE_WIDTH}
        height={TILE_HEIGHT}
        color={theme.colors.ui.secondary}
        direction="row"
        overflow="hidden"
        border_radius="20px"
        style={{
          padding: 18,
        }}
      >
        <Container
          width={IMAGE_WIDTH}
          height="100%"
          color={theme.colors.ui.secondary}
        >
          <Image
            source={imageSource}
            contentFit="contain"
            style={{
              width: "70%",
              height: "70%",
            }}
          />
        </Container>

        <Container width={1} height="85%" color="#898989" />

        <Container
          style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}
          height="100%"
          color={theme.colors.ui.secondary}
          // color={"red"}
          justify="center"
          align="center"
          direction="column"
        >
          <Container width="100%" height="80%" color="transparent">
            <Container
              width="100%"
              height="15%"
              // color="orange"
              color={"transparent"}
              justify={"center"}
              align={"flex-start"}
            >
              <Spacer position="left" size="small">
                <Text variant="raleway_bold_14_white">{title}</Text>
              </Spacer>
            </Container>
            <Container
              width="100%"
              height="15%"
              color=" transparent"
              align={"flex-start"}
            >
              <Spacer position="left" size="small">
                <Text
                  variant="raleway_bold_20_white"
                  adjustsFontSizeToFit
                  numberOfLines={2}
                  minimumFontScale={0.75}
                >
                  {productSubtitleTranslated}
                </Text>
              </Spacer>
            </Container>
            <Container
              width="100%"
              height="15%"
              // color="brown"
              color={"transparent"}
              justify={"center"}
              align={"flex-start"}
            >
              <Spacer position="left" size="small">
                <Text
                  variant="raleway_bold_22_white"
                  adjustsFontSizeToFit
                  numberOfLines={2}
                  minimumFontScale={0.75}
                  // minimumFontScale={0.75}
                >
                  {productNameTranslated}
                </Text>
              </Spacer>
            </Container>
            <Container
              width="100%"
              height="15%"
              // color="blue"
              color={"transparent"}
              justify={"center"}
              align={"flex-start"}
            >
              <Spacer position="left" size="small">
                <Text variant="raleway_bold_14_white">
                  {sizeLabel} - {sizeLabel_ounces}
                </Text>
              </Spacer>
            </Container>
            <Container
              width="100%"
              height="40%"
              // color="black"
              color={"transparent"}
              direction="row"
              justify="space-around"
              align="center"
            >
              <Text variant="dm_sans_bold_32_white">
                {price ? price_formatted : "$0.00"}
              </Text>
              {/* <Container widht="0.5%" color="yellow" /> */}
              <Text variant="raleway_bold_16_white">Qty: {quantity}</Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </>
  );
};
