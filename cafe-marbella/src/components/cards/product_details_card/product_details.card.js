import React from "react";
import { Image } from "react-native";

import { Text } from "../../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Product_Image_Component } from "../product_details_card/product_image.component.js";
import { Product_Initial_Info_Component } from "../product_initial_card/product_intial_info.component.js";

export const Product_Details_Card = ({ item = null }) => {
  console.log("ITEM:", JSON.stringify(item, null, 2));
  const {
    flag_image: FlagImage,
    product_name,
    product_subtitle,
    image,
    rating,
    size_variants,
  } = item || {};

  return (
    <Container
      width="100%"
      height="1100px"
      align="center"
      direction="column"
      justify="flex-start"
      color={theme.colors.bg.elements_bg}
      onPress={() => null}
    >
      <Product_Image_Component image={image} />
      <Container width="100%" height="10%" color={"#898989"} />
      <Product_Initial_Info_Component
        product_name={product_name}
        product_subtitle={product_subtitle}
        size_variants={size_variants}
      />
    </Container>
  );
};
