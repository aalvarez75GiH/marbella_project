import React, { useState } from "react";
import { Image, ScrollView } from "react-native";
import { FlatList } from "react-native";

import {
  Container,
  Pressable_Container,
} from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";

export const Product_Details_Carousel_Component = ({
  setSelectedImageIndex,
  selectedVariant,
  selectedImageIndex,
}) => {
  return (
    <Container
      width="100%"
      //color="lightgray"
      color={theme.colors.bg.elements_bg}
      direction="row"
      align="center"
      justify="space-around"
      padding_vertical="10px"
    >
      <FlatList
        horizontal
        data={selectedVariant.images}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Pressable_Container
            width="95px"
            height="95px"
            border_radius="12px"
            onPress={() => setSelectedImageIndex(index)}
            justify="center"
            align="center"
            overflow="hidden"
            border_width={index === selectedImageIndex ? "2px" : "1px"}
            border_color={
              index === selectedImageIndex ? theme.colors.ui.success : "#E2E2E2"
            }
            color="#F8F8F8"
          >
            <Image
              source={item}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
            />
          </Pressable_Container>
        )}
        contentContainerStyle={{ paddingHorizontal: 10, gap: 10 }}
      />
    </Container>
  );
};
