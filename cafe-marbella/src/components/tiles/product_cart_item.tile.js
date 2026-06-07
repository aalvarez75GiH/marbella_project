import React, { useContext } from "react";
import { Image } from "expo-image";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Platform, Dimensions } from "react-native";

import {
  Action_Container,
  Container,
} from "../../components/containers/general.containers";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import RemoveIcon from "../../../assets/my_icons/remove_icon.svg";
import { Text } from "../../infrastructure/typography/text.component";

import { CartContext } from "../../infrastructure/services/cart/cart.context";
import { GlobalContext } from "../../infrastructure/services/global/global.context";

export const Product_Cart_Item_Tile = ({ product, image }) => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const navigation = useNavigation();

  const { width } = Dimensions.get("window");
  const TILE_WIDTH = width * 0.92;
  const TILE_HEIGHT = TILE_WIDTH * 0.58;
  const IMAGE_WIDTH = TILE_WIDTH * 0.26;

  const imageSource = typeof image === "string" ? { uri: image } : image;
  const { increaseCartItemQty, decreaseCartItemQty, removingProductFromCart } =
    useContext(CartContext);

  const { size_variants } = product || {};
  const { sizeLabel, sizeLabel_ounces, price, quantity } = size_variants[0];

  const { formatCentsToUSD, getTranslatedField } = useContext(GlobalContext);
  const price_formatted = formatCentsToUSD(price);

  const { title, product_name, product_subtitle } = product || {};

  const productNameTranslated = getTranslatedField(product_name, lang);
  const productSubtitleTranslated = getTranslatedField(product_subtitle, lang);

  const onTrashPress = async (item) => {
    const res = await removingProductFromCart(item);
    if (res?.ok && res?.becameEmpty) {
      navigation.goBack(); // ✅ only happens once, on the correct screen
    }
  };

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
            <Action_Container
              width="100%"
              height="15%"
              // color="orange"
              color={theme.colors.ui.secondary}
              justify="center"
              align="flex-end"
              onPress={() => onTrashPress(product)}
            >
              <Spacer position="right" size="large">
                <RemoveIcon width={20} height={20} fill={"#FFFFFF"} />
              </Spacer>
            </Action_Container>
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
              <Container
                width="55%"
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
                  onPress={() => decreaseCartItemQty(product)}
                  justify="flex-start" // Center content vertically
                  align="center" // Center content horizontally
                >
                  <Text
                    variant={
                      Platform.OS === "ios"
                        ? "raleway_bold_16_white"
                        : "raleway_bold_10_white"
                    }
                    style={{
                      color: theme.colors.ui.tertiary,
                    }}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
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
                  onPress={() => increaseCartItemQty(product)}
                  justify="center"
                  align="center"
                >
                  <Text
                    style={{
                      color: theme.colors.ui.tertiary,
                    }}
                    variant={
                      Platform.OS === "ios"
                        ? "raleway_bold_16_white"
                        : "raleway_bold_12_white"
                    }
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
