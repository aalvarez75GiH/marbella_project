import React, { useContext } from "react";
import { Image } from "expo-image";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

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
            contentFit="contain"
            transition={300} // smooth fade-in // replaces resizeMode
            style={{
              width: "65%",
              height: "65%",
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
              onPress={() => onTrashPress(product)}
            >
              <RemoveIcon width={20} height={20} fill={"#FFFFFF"} />
            </Action_Container>
          </Container>
          <Container
            width="100%"
            height="45%"
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
                <Text variant="raleway_bold_14_white">{title}</Text>
                <Text variant="raleway_bold_24_white">
                  {productSubtitleTranslated}
                </Text>
                <Text variant="raleway_bold_14_white">
                  {productNameTranslated}
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
                {price ? price_formatted : "0.00"}
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
                  onPress={() => decreaseCartItemQty(product)}
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
                  onPress={() => increaseCartItemQty(product)}
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
