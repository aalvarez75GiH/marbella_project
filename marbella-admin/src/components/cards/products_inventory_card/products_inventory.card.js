import React, { useContext } from "react";
import { View } from "react-native";
import { Image } from "expo-image";

import { Text } from "../../../infrastructure/typography/text.component.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Product_Initial_Info_Component } from "./product_intial_info.component.js";
import { DataInput } from "../../inputs/data_text_input.js";
import NotImageYet from "../../../../assets/my_icons/broken-image.png";

import { GlobalContext } from "../../../infrastructure/services/global/global.context.js";

export const Products_Inventory_Card = ({
  item = null,
  onChangeVariantQty,
}) => {
  const {
    id: productId,
    product_name,
    product_subtitle,
    size_variants = [],
  } = item || {};
  const { getText } = useContext(GlobalContext);
  const defaultVariant =
    size_variants.find((v) => v.isDefault) || size_variants[0];

  const productMainImage = defaultVariant?.images?.[0];
  const imageSource =
    typeof productMainImage === "string"
      ? { uri: productMainImage }
      : productMainImage;
  console.log("PRODUCT MAIN IMAGE SOURCE:", imageSource);
  const isValidImage = imageSource === undefined;

  return (
    <View
      style={{
        width: 370,
        backgroundColor: theme.colors.bg.elements_bg,
        borderRadius: 14,
        padding: 16,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 180,
          height: 180,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={isValidImage ? NotImageYet : imageSource}
          style={{
            width: isValidImage ? "190%" : "90%",
            height: isValidImage ? "50%" : "90%",
          }}
          contentFit="contain" // replaces resizeMode
          transition={300} // smooth fade-in
          placeholder="blurhash-string"
        />
        {isValidImage && (
          <Text
            variant="dm_sans_bold_14"
            style={{ color: theme.colors.ui.error, marginTop: "10px" }}
          >
            Not image yet
          </Text>
        )}
      </View>

      <View style={{ height: 12 }} />

      <Product_Initial_Info_Component
        product_name={getText(product_name)}
        product_subtitle={getText(product_subtitle)}
        size_variants={size_variants}
      />

      <View style={{ height: 16 }} />

      <View style={{ width: "100%" }}>
        {size_variants.map((variant) => (
          <View
            key={`${productId}:${variant.id}`}
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: "28%",
                justifyContent: "center",
              }}
            >
              <Text variant="dm_sans_bold_14">{variant.sizeLabel}</Text>
            </View>
            <View
              style={{
                width: "38%",
                justifyContent: "center",
              }}
            >
              <DataInput
                value={String(variant.qty ?? 0)}
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
                  fontSize: 16,
                  height: 42,
                }}
                contentStyle={{
                  fontFamily: "ralewayBold",
                  fontSize: 16,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
