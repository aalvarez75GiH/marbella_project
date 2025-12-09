import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Action_Container } from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Rating_And_Country_Flag_Component } from "./rating_and_country_flag.component.js";
import { Product_Image_Component } from "./product_image.component.js";
import { Product_Initial_Info_Component } from "./product_intial_info.component.js";
import { Product_Identification_Line } from "./product_identification_line.component.js";

export const Product_Initial_Card = ({ item = null }) => {
  console.log("ITEM:", JSON.stringify(item, null, 2));
  const {
    flag_image: FlagImage,
    product_name,
    product_subtitle,
    image,
    rating,
    size_variants,
  } = item || {};
  const navigation = useNavigation();
  return (
    <Action_Container
      width="370px"
      height="480px"
      align="center"
      direction="column"
      justify="flex-start"
      color={theme.colors.bg.elements_bg}
      onPress={() => navigation.navigate("Shop_Product_Details_View", { item })}
    >
      <Rating_And_Country_Flag_Component
        rating={rating}
        FlagImage={FlagImage}
      />
      <Product_Image_Component image={image} />
      <Product_Initial_Info_Component
        product_name={product_name}
        product_subtitle={product_subtitle}
        size_variants={size_variants}
      />

      <Product_Identification_Line product_color={"#CA7B53"} />
    </Action_Container>
  );
};
