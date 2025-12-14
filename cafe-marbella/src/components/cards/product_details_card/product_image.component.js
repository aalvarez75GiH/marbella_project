import React from "react";
import { Image } from "react-native";
import { theme } from "../../../infrastructure/theme/index.js";

import {
  Container,
  Action_Container,
} from "../../containers/general.containers.js";

export const Product_Image_Component = ({ image }) => {
  return (
    <Container
      width="100%"
      // height="65%"
      color={theme.colors.bg.elements_bg}
      // color={"red"}
      justify="center"
      align="center"
      // style={{ paddingRight: "5%" }}
      style={{ paddingRight: "5%", height: 350 }}
    >
      {/* <Container
      width="100%"
      height="90%"
      color={theme.colors.bg.elements_bg}
      // color={"red"}
      justify="center"
      align="center"
      style={{ paddingRight: "5%" }}
    > */}
      <Image
        // source={images[item.image]}
        source={image}
        style={{
          width: "90%",
          height: "90%",
          resizeMode: "contain", // Ensures the image fits without distortion
        }}
      />
    </Container>
  );
};
