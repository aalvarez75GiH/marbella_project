import React, { useState } from "react";
import { Image } from "react-native";
import {
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";

import { Text } from "../../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Product_Image_Component } from "../product_details_card/product_image.component.js";
import { Product_Initial_Info_Component } from "../product_initial_card/product_intial_info.component.js";
import { Product_Details_Info_Component } from "../product_details_card/product_details_info.component.js";
import { Product_Details_Carousel_Component } from "./product_details_carousel.component.js";
import { Spacer } from "../../spacers and globals/optimized.spacer.component.js";
import { Product_Size_Options_Component } from "./product_size_options.component.js";
import { ProductCardContainer } from "./react_native_paper.card.js";

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
  // Card
  return (
    <Container
      width="100%"
      direction="column"
      justify="flex-start"
      align="center"
      color={theme.colors.bg.screens_bg}
    >
      <Product_Image_Component
        image={selectedVariant.images[selectedImageIndex]}
      />
      <Spacer position="top" size="small" />
      <Product_Details_Carousel_Component
        item={item}
        setSelectedImageIndex={setSelectedImageIndex}
        selectedVariant={selectedVariant}
        selectedImageIndex={selectedImageIndex}
      />
      <Spacer position="top" size="small" />
      <Product_Details_Info_Component
        product_name={product_name}
        product_subtitle={product_subtitle}
        size_variants={size_variants}
        selectedVariant={selectedVariant}
        selectedVariantId={selectedVariantId}
        setSelectedVariantId={setSelectedVariantId}
      />
      <Spacer position="top" size="small" />
      <Product_Size_Options_Component
        item={item}
        selectedVariant={selectedVariant}
        selectedVariantId={selectedVariantId}
        setSelectedVariantId={setSelectedVariantId}
        setSelectedImageIndex={setSelectedImageIndex}
      />

      {/* add this temporarily to prove scroll works */}
      <View style={{ height: 40 }} />
    </Container>
  );
};

//   return (
//     <Container
//       width="100%"
//       //   height="550px"
//       justify="flex-start"
//       align="center"
//       color={theme.colors.bg.screens_bg}
//       // color="#FAD"
//     >
//       <>
//         <Container
//           width="100%"
//           height="350px"
//           color={theme.colors.bg.elements_bg}
//         >
//           <Product_Image_Component
//             image={selectedVariant.images[selectedImageIndex]}
//           />
//         </Container>
//         <Spacer position="top" size="small" />
//         <Container width="100%" height="120px" color={"lightgreen"}>
//           <Product_Details_Carousel_Component
//             item={item}
//             setSelectedImageIndex={setSelectedImageIndex}
//             selectedVariant={selectedVariant}
//             selectedImageIndex={selectedImageIndex}
//           />
//         </Container>
//         <Spacer position="top" size="small" />
//         <Container width="100%" height="180px" color={"yellow"}>
//           <Product_Details_Info_Component
//             product_name={product_name}
//             product_subtitle={product_subtitle}
//             size_variants={size_variants}
//             selectedVariant={selectedVariant}
//             selectedVariantId={selectedVariantId}
//             setSelectedVariantId={setSelectedVariantId}
//           />
//         </Container>

//         <Spacer position="top" size="small" />
//         <Container width="100%" height="120px" color={"red"}>
//           <Product_Size_Options_Component
//             item={item}
//             selectedVariant={selectedVariant}
//             selectedVariantId={selectedVariantId}
//             setSelectedVariantId={setSelectedVariantId}
//             setSelectedImageIndex={setSelectedImageIndex}
//           />
//         </Container>
//       </>
//     </Container>
//   );
// };
