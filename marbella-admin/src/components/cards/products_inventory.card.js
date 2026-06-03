import React from "react";

import {
  Container,
  Action_Container,
} from "../../components/containers/general.containers.js";
import { Text } from "../../infrastructure/typography/text.component.js";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Product_Inventory_Edit_Card = ({
  product,
  onChangeVariantQty,
}) => {
  const {
    id: productId,
    product_name,
    product_subtitle,
    size_variants = [],
  } = product || {};

  const product_name_en =
    typeof product_name === "object" ? product_name.en : product_name;
  const product_subtitle_en =
    typeof product_subtitle === "object"
      ? product_subtitle.en
      : product_subtitle;
  console.log("PRODUCT NAME:", JSON.stringify(product_name, null, 2));
  console.log("PRODUCT SUBTITLE:", JSON.stringify(product_subtitle, null, 2));

  const getText = (value, lang = "en") => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (value && typeof value === "object") {
      return value[lang] || value.en || value.es || "";
    }
    return "";
  };

  return (
    <Container
      width="100%"
      color={theme.colors.bg.elements_bg}
      justify="flex-start"
      align="center"
      direction="column"
      style={{
        borderRadius: 14,
        paddingVertical: 16,
        marginBottom: 12,
      }}
    >
      <Container
        width="92%"
        color={theme.colors.bg.elements_bg}
        align="flex-start"
      >
        {/* <Text variant="raleway_bold_16">{product_name_en}</Text> */}
        {/* <Text variant="dm_sans_regular_14">{product_subtitle_en}</Text> */}
        {/* <Text variant="raleway_bold_16">{getText(product_name)}</Text> */}
        {/* <Text variant="dm_sans_regular_14">{getText(product_subtitle)}</Text> */}
      </Container>

      <Container
        width="92%"
        color={theme.colors.bg.elements_bg}
        style={{ marginTop: 14 }}
      >
        {size_variants.map((variant) => (
          <Container
            key={`${productId}:${variant.id}`}
            width="100%"
            color={theme.colors.bg.elements_bg}
            direction="row"
            justify="space-between"
            align="center"
            style={{ marginBottom: 12 }}
          >
            <Container
              width="35%"
              color={theme.colors.bg.elements_bg}
              align="flex-start"
              justify="center"
            >
              <Text variant="dm_sans_regular_14">{variant.sizeLabel}</Text>
            </Container>

            <Container
              width="60%"
              color={theme.colors.bg.elements_bg}
              justify="center"
            >
              <DataInput
                value={String(variant.qty ?? 0)}
                onChangeText={(value) => {
                  const numericValue = value.replace(/[^0-9]/g, "");
                  onChangeVariantQty(productId, variant.id, numericValue);
                }}
                keyboardType="numeric"
                label=""
                border_color={theme.colors.inputs.bottom_lines_disabled}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                activeUnderlineColor={theme.colors.ui.primary}
                style={{
                  backgroundColor: "#F5F5F5",
                  fontSize: 16,
                }}
                contentStyle={{
                  fontFamily: "ralewayBold",
                  fontSize: 16,
                }}
              />
            </Container>
          </Container>
        ))}
      </Container>
    </Container>
  );
};
