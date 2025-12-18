import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";

import { Text } from "../../../infrastructure/typography/text.component.js";
import {
  Container,
  Pressable_Container,
} from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Spacer } from "../../../components/spacers and globals/optimized.spacer.component.js";
import { CartContext } from "../../../infrastructure/services/cart/cart.context.js";

export const Product_Details_Info_Component = ({
  product_name,
  product_subtitle,
  selectedVariant,
  product_to_add_to_cart,
}) => {
  const navigation = useNavigation();
  const { addingProductToCart } = useContext(CartContext);

  console.log(
    "PRODUCT TO ADD TO CART:",
    JSON.stringify(product_to_add_to_cart, null, 2)
  );

  return (
    <Container
      width="100%"
      color={theme.colors.bg.elements_bg}
      align="flex-start"
      direction="column"
      justify="flex-start"
      padding_vertical="16px"
    >
      <Spacer position="left" size="large">
        <Text variant="raleway_bold_20">{product_name}</Text>
        <Text variant="raleway_bold_20">{product_subtitle}</Text>
      </Spacer>

      <Container
        width="100%"
        direction="row"
        justify="flex-start"
        align="center"
        color={theme.colors.bg.elements_bg}
      >
        <Spacer position="left" size="large">
          <Text variant="raleway_bold_20">{selectedVariant.sizeLabel}</Text>
        </Spacer>

        <Spacer position="left" size="medium" />
        <Container width="2px" height="25px" color="#000000" />
        <Spacer position="left" size="large" />
        <Text variant="raleway_bold_18">
          {selectedVariant.sizeLabel_ounces}
        </Text>
      </Container>

      <Container
        width="100%"
        direction="row"
        justify="space-between"
        align="center"
        style={{ marginTop: 16 }}
        color={theme.colors.bg.elements_bg}
      >
        <Container
          width="50%"
          justify="center"
          align="flex-start"
          color={theme.colors.bg.elements_bg}
        >
          <Spacer position="left" size="large">
            <Text
              variant="dm_sans_bold_28"
              style={{ color: theme.colors.text.success }}
            >
              {selectedVariant.price ? `$${selectedVariant.price}` : null}
            </Text>
          </Spacer>
        </Container>

        <Container
          width="50%"
          justify="center"
          align="center"
          color={theme.colors.bg.elements_bg}
        >
          <Pressable_Container
            width="65%"
            height="44px" // ✅ fixed button height
            border_radius="30px"
            color={theme.colors.ui.success}
            justify="center"
            align="center"
            onPress={() => {
              addingProductToCart(
                product_to_add_to_cart,
                navigation,
                "Shop_Shopping_Cart_View"
              );
            }}
          >
            <Text
              variant="dm_sans_bold_16_white"
              //   style={{ textDecorationLine: "underline" }}
            >
              Add to cart
            </Text>
          </Pressable_Container>
        </Container>
      </Container>
    </Container>
  );
};
