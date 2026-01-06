import React from "react";
import { useNavigation } from "@react-navigation/native";

import {
  Action_Container,
  Container,
} from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Rating_And_Country_Flag_Component } from "./rating_and_country_flag.component.js";
import { Product_Image_Component } from "./product_image.component.js";
import { Product_Initial_Info_Component } from "./product_intial_info.component.js";
import { Product_Identification_Line } from "./product_identification_line.component.js";
import { FLAGS_BY_KEY } from "../../../infrastructure/local_data/images_mapping/flags.maps.js";
import { Text } from "../../../infrastructure/typography/text.component.js";
import { Product_Initial_OOS_Info_Component } from "./product_initial_oos_info.component.js";

export const Product_Initial_Card = ({ item = null }) => {
  const {
    // flag_image: FlagImage,
    flag_key,
    product_name,
    product_subtitle,
    rating,
    size_variants,
    totalStock,
  } = item || {};

  console.log("TOTAL STOCK:", totalStock);
  // console.log("Product_Initial_Card ITEM:", JSON.stringify(item, null, 2));

  const normalizedFlagKey = String(flag_key ?? "")
    .trim()
    .toLowerCase();
  const FlagImage = FLAGS_BY_KEY[normalizedFlagKey] ?? null;

  const defaultVariant =
    item.size_variants.find((v) => v.isDefault) || item.size_variants[0];
  const productMainImage = defaultVariant.images[0];

  const navigation = useNavigation();

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
      // onPress={() => handleNavigate(item)}
      onPress={
        () => (totalStock > 0 ? handleNavigate(item) : null) // Replace with your desired action
      }
    >
      <Rating_And_Country_Flag_Component
        rating={rating}
        FlagImage={FlagImage}
      />
      <Product_Image_Component image={productMainImage} />
      {totalStock > 0 && (
        <Product_Initial_Info_Component
          product_name={product_name}
          product_subtitle={product_subtitle}
          size_variants={size_variants}
        />
      )}
      {totalStock === 0 && <Product_Initial_OOS_Info_Component />}

      <Product_Identification_Line product_color={"#CA7B53"} />
    </Action_Container>
  );
};
