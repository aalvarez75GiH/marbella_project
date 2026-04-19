import React from "react";
import { View, Image } from "react-native";
import { Text } from "../../../infrastructure/typography/text.component.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Product_Initial_Info_Component } from "./product_intial_info.component.js";
import { DataInput } from "../../inputs/data_text_input.js";

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

  const defaultVariant =
    size_variants.find((v) => v.isDefault) || size_variants[0];

  const productMainImage = defaultVariant?.images?.[0];

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
          source={productMainImage}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>

      <View style={{ height: 12 }} />

      <Product_Initial_Info_Component
        product_name={product_name}
        product_subtitle={product_subtitle}
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
