import React from "react";
import { Image } from "react-native";
import { theme } from "../../../infrastructure/theme/index.js";
import { Container } from "../../containers/general.containers.js";

export const Product_Image_Component = ({ image }) => {
  const imageSource = typeof image === "string" ? { uri: image } : image;

  console.log("IMAGE SOURCE IN PRODUCT IMAGE COMPONENT: ", imageSource);

  return (
    <Container
      width="100%"
      height="60%"
      color={theme.colors.bg.elements_bg}
      justify="center"
      align="center"
      style={{ paddingRight: "5%" }}
    >
      <Image
        source={imageSource}
        style={{
          width: "90%",
          height: "90%",
        }}
        resizeMode="contain"
      />
    </Container>
  );
};
