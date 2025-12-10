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
      color={theme.colors.bg.elements_bg}
      onPress={() => null}
    >
      {/* <Product_Image_Component image={main_image} /> */}
      <Product_Image_Component
        image={selectedVariant.images[selectedImageIndex]}
      />
      {/* <Container width="100%" height="10%" color={"#898989"} /> */}
      <View style={styles.thumbnailRow}>
        {selectedVariant.images.map((imgSrc, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedImageIndex(index)}
            style={[
              styles.thumbnailWrapper,
              index === selectedImageIndex && styles.thumbnailActive,
            ]}
          >
            <Image source={imgSrc} style={styles.thumbnail} />
          </Pressable>
        ))}
      </View>
      <Product_Initial_Info_Component
        product_name={product_name}
        product_subtitle={product_subtitle}
        size_variants={size_variants}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  thumbnailRow: {
    flexDirection: "row",
    alignItems: "space-around",
    gap: 20, // works in RN 0.71+, otherwise replace with margin
    marginTop: 12,
  },

  thumbnailWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E2E2",
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },

  thumbnailActive: {
    borderWidth: 2,
    borderColor: theme.colors.ui.success, // darker border to indicate selection
  },

  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
