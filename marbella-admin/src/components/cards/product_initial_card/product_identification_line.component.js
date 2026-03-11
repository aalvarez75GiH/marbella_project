import React from "react";

import { Container } from "../../containers/general.containers.js";
import { Spacer } from "../../../components/spacers and globals/optimized.spacer.component.js";

export const Product_Identification_Line = ({ product_color }) => {
  return (
    <>
      <Spacer position="top" size="small" />
      <Container
        width="100%"
        height="3%"
        //color={theme.colors.bg.elements_bg}
        color={product_color}
        justify="center"
        align="center"
        style={{ paddingRight: "6%" }}
      ></Container>
    </>
  );
};
