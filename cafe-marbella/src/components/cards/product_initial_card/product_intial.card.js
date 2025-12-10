import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Action_Container } from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Rating_And_Country_Flag_Component } from "./rating_and_country_flag.component.js";
import { Product_Image_Component } from "./product_image.component.js";
import { Product_Initial_Info_Component } from "./product_intial_info.component.js";
import { Product_Identification_Line } from "./product_identification_line.component.js";

export const Product_Initial_Card = ({ item = null }) => {
  console.log("ITEM AT INITIAL CARD:", JSON.stringify(item, null, 2));
  const {
    flag_image: FlagImage,
    product_name,
    product_subtitle,
    // main_image,
    rating,
    size_variants,
  } = item || {};

  const defaultVariant =
    item.size_variants.find((v) => v.isDefault) || item.size_variants[0];
  const productMainImage = defaultVariant.images[0];

  const navigation = useNavigation();
  // Assuming you are navigating to the next screen

  const handleNavigate = (item) => {
    const { flag_image, ...itemWithoutFlagImage } = item; // Exclude flag_image
    navigation.navigate("Shop_Product_Details_View", {
      item: itemWithoutFlagImage,
    });
  };

  return (
    <Action_Container
      width="370px"
      height="480px"
      align="center"
      direction="column"
      justify="flex-start"
      color={theme.colors.bg.elements_bg}
      // onPress={() => navigation.navigate("Shop_Product_Details_View", { item })}
      onPress={() => handleNavigate(item)}
    >
      <Rating_And_Country_Flag_Component
        rating={rating}
        FlagImage={FlagImage}
      />
      <Product_Image_Component image={productMainImage} />
      <Product_Initial_Info_Component
        product_name={product_name}
        product_subtitle={product_subtitle}
        size_variants={size_variants}
      />

      <Product_Identification_Line product_color={"#CA7B53"} />
    </Action_Container>
  );
};
