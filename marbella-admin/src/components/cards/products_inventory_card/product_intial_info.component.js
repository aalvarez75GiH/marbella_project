import React from "react";
import { View } from "react-native";

import { Text } from "../../../infrastructure/typography/text.component.js";
import { theme } from "../../../infrastructure/theme/index.js";

export const Product_Initial_Info_Component = ({
  product_name,
  product_subtitle,
  size_variants = [],
}) => {
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: theme.colors.bg.elements_bg,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginTop: 8,
      }}
    >
      <View
        style={{
          width: "75%",
        }}
      >
        <Text variant="raleway_bold_18">{product_name}</Text>
        <Text variant="raleway_bold_18">{product_subtitle}</Text>
      </View>
    </View>
  );
};
