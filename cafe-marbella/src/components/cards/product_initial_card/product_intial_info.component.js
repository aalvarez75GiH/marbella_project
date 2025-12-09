import React from "react";
import { Image } from "react-native";

import { Text } from "../../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Spacer } from "../../../components/spacers and globals/optimized.spacer.component.js";
import StarIcon from "../../../../assets/my_icons/star_icon.svg";
import { Rating_And_Country_Flag_Component } from "./rating_and_country_flag.component.js";
import { Product_Image_Component } from "./product_image.component.js";

export const Product_Initial_Info_Component = ({
  product_name,
  product_subtitle,
  size_variants,
}) => {
  return (
    <Container
      width="100%"
      height="26%"
      //color={theme.colors.bg.elements_bg}
      color={"lightgreen"}
      justify="center"
      align="center"
      direction="row"
    >
      <Container
        width="75%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        // color={"#CAD"}
        justify="flex-start"
        align="flex-start"
        // style={{ paddingRight: "5%" }}
      >
        <Spacer position="top" size="large" />
        <Spacer position="left" size="large">
          <Text variant="raleway_bold_18">{product_name}</Text>
          <Text variant="raleway_bold_18">{product_subtitle}</Text>
        </Spacer>
        <Container
          width="100%"
          height="45%"
          color={theme.colors.bg.elements_bg}
          // color={"blue"}
          justify="flex-start"
          align="flex-start"
          direction="row"
        >
          <Spacer position="left" size="large" />
          <Text variant="raleway_bold_18">{size_variants[0].sizeLabel}</Text>
          <Spacer position="left" size="medium" />
          <Container width="2px" height="25px" color="#000000" />
          <Spacer position="left" size="large" />
          <Text variant="raleway_bold_18">{size_variants[1].sizeLabel}</Text>
          <Spacer position="left" size="medium" />
          <Container width="2px" height="25px" color="#000000" />
          <Spacer position="left" size="large" />
          <Text variant="raleway_bold_18">{size_variants[2].sizeLabel}</Text>
        </Container>
      </Container>
      <Container
        width="25%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        // color="lightyellow"
        justify="center"
        align="center"
        // style={{ paddingRight: "5%" }}
      >
        <Text
          variant="raleway_bold_14"
          style={{ color: "#247F35", textDecorationLine: "underline" }}
        >
          View
        </Text>
      </Container>
    </Container>
  );
};
