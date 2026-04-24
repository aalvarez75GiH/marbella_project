import React from "react";
import { Image } from "expo-image";

import { theme } from "../../../infrastructure/theme/index.js";

import { Container } from "../../containers/general.containers.js";

export const Product_Image_Component = ({ image }) => {
  const imageSource = typeof image === "string" ? { uri: image } : image;
  return (
    <Container
      width="100%"
      height={"60%"}
      color={theme.colors.bg.elements_bg}
      // color={"red"}
      justify="center"
      align="center"
      style={{ paddingRight: "5%", height: 350 }}
    >
      <Image
        source={imageSource}
        style={{ width: "90%", height: "90%" }}
        contentFit="contain" // replaces resizeMode
        transition={300}
        placeholder="blurhash-string"
      />
    </Container>
  );
};
