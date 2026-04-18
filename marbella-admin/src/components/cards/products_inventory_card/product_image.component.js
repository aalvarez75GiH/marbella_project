import React from "react";
import { Image } from "react-native";
import { theme } from "../../../infrastructure/theme/index.js";
import { Container } from "../../containers/general.containers.js";

export const Product_Image_Component = ({ image }) => {
  return (
    <Container
      width="100%"
      height="180px"
      color={theme.colors.bg.elements_bg}
      justify="center"
      align="center"
    >
      <Image
        source={image}
        style={{
          width: "90%",
          height: "90%",
        }}
        resizeMode="contain"
      />
    </Container>
  );
};
