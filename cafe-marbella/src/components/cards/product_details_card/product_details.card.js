import React, { useState } from "react";

import { Container } from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Product_Image_Component } from "../product_details_card/product_image.component.js";
import { Product_Details_Info_Component } from "../product_details_card/product_details_info.component.js";
import { Product_Details_Carousel_Component } from "./product_details_carousel.component.js";
import { Spacer } from "../../spacers and globals/optimized.spacer.component.js";
import { Product_Size_Options_Component } from "./product_size_options.component.js";
import { Product_Details_Description_Component } from "./product_details_description.component.js";
import { Product_Details_Avail_Promotion_Component } from "./product_details_availability.component.js";

export const Product_Details_Card = ({ item = null }) => {
  console.log("ITEM AT PRODUCT DETAILS CARD:", JSON.stringify(item, null, 2));
  const { product_name, product_subtitle, size_variants } = item || {};

  const defaultVariant =
    item.size_variants.find((v) => v.isDefault) || item.size_variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant.id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const selectedVariant =
    item.size_variants.find((v) => v.id === selectedVariantId) ||
    defaultVariant;
  console.log("SELECTED VARIANT ID:", selectedVariantId);
  console.log("SELECTED IMAGE ID:", selectedVariant.images[selectedImageIndex]);
  console.log("QUANTITY:", selectedVariant.quantity);

  const product_to_add_to_cart = {
    ...item,
    size_variants: [selectedVariant], // Replace all variants with the selected one
  };

  return (
    <Container
      width="100%"
      direction="column"
      justify="flex-start"
      align="center"
      color={theme.colors.bg.screens_bg}
      //color={"red"}
    >
      <Product_Details_Avail_Promotion_Component
        qty={selectedVariant.quantity}
        promotion={selectedVariant.promotion}
      />
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
        product_to_add_to_cart={product_to_add_to_cart}
      />
      <Spacer position="top" size="small" />
      <Product_Size_Options_Component
        item={item}
        selectedVariant={selectedVariant}
        selectedVariantId={selectedVariantId}
        setSelectedVariantId={setSelectedVariantId}
        setSelectedImageIndex={setSelectedImageIndex}
      />
      <Product_Details_Description_Component item={item} />
    </Container>
  );
};
