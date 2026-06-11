import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";

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
import { Product_Initial_OOS_Info_Component } from "./product_initial_oos_info.component.js";
import { DataInput } from "../../inputs/data_text_input.js";
import { Text } from "../../../infrastructure/typography/text.component.js";

export const Product_Initial_Card = ({ item = null, onChangeVariantQty }) => {
  const {
    id: productId,
    flag_key,
    product_name,
    product_subtitle,
    rating,
    size_variants = [],
    totalStock,
    totalQty,
    grindType,
  } = item || {};
  const stock = Number(totalStock ?? totalQty ?? 0);
  console.log("STOCK VALUE AT PRODUCT INITIAL CARD:", stock);

  // console.log("PRODUCT INITIAL CARD ITEM:", JSON.stringify(item, null, 2));

  const normalizedFlagKey = String(flag_key ?? "")
    .trim()
    .toLowerCase();
  const FlagImage = FLAGS_BY_KEY[normalizedFlagKey] ?? null;

  const defaultVariant =
    item?.size_variants?.find((v) => v.isDefault) || item?.size_variants?.[0];

  const productMainImage = defaultVariant?.images?.[0] ?? null;

  return (
    <Action_Container
      width="370px"
      height="480px"
      align="center"
      direction="column"
      justify="flex-start"
      color={theme.colors.bg.elements_bg}
      onPress={() => null}
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
      {/* ***************************************************** */}

      <Container
        width="100%"
        color={theme.colors.bg.elements_bg}
        height={"25%"}
        direction="row"
      >
        {size_variants.map((variant) => (
          <Container
            width="35%"
            height="75%"
            direction="column"
            align="center"
            justify="space-around"
            marginBottom={12}
            key={`${productId}:${variant.id}`}
            // color="lightblue"
            color={theme.colors.bg.elements_bg}
          >
            <Container
              width="85%"
              height="30%"
              justify="center"
              color={theme.colors.bg.elements_bg}
            >
              <Text variant="dm_sans_bold_16">{variant.sizeLabel}</Text>
            </Container>
            <Container
              width="100%"
              height="45%"
              justify="center"
              align="center"
              color={theme.colors.bg.elements_bg}
            >
              <DataInput
                // value={String(variant.qty ?? 0)}
                value={String(variant.qty ?? "")}
                onChangeText={(value) => {
                  const numericValue = value.replace(/[^0-9]/g, "");
                  onChangeVariantQty?.(productId, variant.id, numericValue);
                }}
                keyboardType="numeric"
                label=""
                border_color={theme.colors.inputs.bottom_lines_disabled}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                activeUnderlineColor={theme.colors.ui.primary}
                style={{
                  backgroundColor: "#F5F5F5",
                  fontSize: 20,
                  height: 35,
                }}
                contentStyle={{
                  fontFamily: "ralewayBold",
                  fontSize: 16,
                  alignSelf: "center",
                }}
              />
            </Container>
          </Container>
        ))}
      </Container>

      <Product_Identification_Line
        product_color={grindType === "ground" ? "#FAB844" : "#FB4762"}
      />
    </Action_Container>
  );
};
