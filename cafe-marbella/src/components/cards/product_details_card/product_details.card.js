import React, { useState } from "react";
import { Image } from "react-native";
import { View, Pressable, StyleSheet } from "react-native";

import { Text } from "../../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Product_Image_Component } from "../product_details_card/product_image.component.js";
import { Product_Initial_Info_Component } from "../product_initial_card/product_intial_info.component.js";
import { Product_Details_Info_Component } from "../product_details_card/product_details_info.component.js";
import { Product_Details_Carousel_Component } from "./product_details_carousel.component.js";
import { Spacer } from "../../spacers and globals/optimized.spacer.component.js";
import { Product_Size_Options_Component } from "./product_size_options.component.js";

export const Product_Details_Card = ({ item = null }) => {
  console.log("ITEM AT PRODUCT DETAILS CARD:", JSON.stringify(item, null, 2));
  const { product_name, product_subtitle, main_image, size_variants } =
    item || {};

  const defaultVariant =
    item.size_variants.find((v) => v.isDefault) || item.size_variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant.id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const selectedVariant =
    item.size_variants.find((v) => v.id === selectedVariantId) ||
    defaultVariant;
  console.log("SELECTED VARIANT ID:", selectedVariantId);
  console.log("SELECTED IMAGE ID:", selectedVariant.images[selectedImageIndex]);

  return (
    <Container
      width="100%"
      height="1100px"
      align="center"
      direction="column"
      justify="flex-start"
      color={theme.colors.bg.screens_bg}
      onPress={() => null}
    >
      {/* <Product_Image_Component image={main_image} /> */}
      <Product_Image_Component
        image={selectedVariant.images[selectedImageIndex]}
      />
      <Spacer position="top" size="small" />
      <Product_Details_Carousel_Component
        item={item}
        setSelectedImageIndex={setSelectedImageIndex}
        selectedVariant={selectedVariant}
        selectedImageIndex={selectedImageIndex}
      />
      <Spacer position="top" size="small" />

      <Product_Details_Info_Component
        product_name={product_name}
        product_subtitle={product_subtitle}
        size_variants={size_variants}
        selectedVariant={selectedVariant}
        selectedVariantId={selectedVariantId}
        setSelectedVariantId={setSelectedVariantId}
      />

      <Spacer position="top" size="small" />
      <Product_Size_Options_Component
        item={item}
        selectedVariant={selectedVariant}
        selectedVariantId={selectedVariantId}
        setSelectedVariantId={setSelectedVariantId}
        setSelectedImageIndex={setSelectedImageIndex}
      />
    </Container>
  );
};
