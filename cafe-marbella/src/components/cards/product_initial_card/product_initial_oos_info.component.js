import React from "react";

import { Text } from "../../../infrastructure/typography/text.component.js";
import { Container } from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Spacer } from "../../../components/spacers and globals/optimized.spacer.component.js";
import { Regular_CTA } from "../../ctas/regular.cta.js";

export const Product_Initial_OOS_Info_Component = ({
  product_name,
  product_subtitle,
  size_variants,
}) => {
  // console.log("PRODUCT NAME:", product_name);
  return (
    <Container
      width="100%"
      height="26%"
      justify="center"
      align="center"
      //   color={theme.colors.bg.elements_bg}
      color="red"
      direction="row"
    >
      <Container
        width="70%"
        height="100%"
        justify="center"
        align="flex-start"
        color={theme.colors.bg.elements_bg}
        // color={theme.colors.ui.error_light}
        // color="green"
        padding_horizontal="15px"
      >
        <Text variant="raleway_bold_18">{product_name}</Text>
        <Text variant="raleway_bold_18">{product_subtitle}</Text>
        <Spacer position="top" size="medium" />
        <Text
          variant="dm_sans_bold_18"
          style={{ color: theme.colors.ui.error }}
        >
          Out of Stock
        </Text>
      </Container>
      <Container
        width="30%"
        height="100%"
        justify="center"
        align="center"
        color={theme.colors.bg.elements_bg}
        //color="yellow"
      >
        <Text
          variant="dm_sans_bold_16"
          style={{ textDecorationLine: "underline", textAlign: "center" }}
        >
          Where to buy?
        </Text>
      </Container>
    </Container>
  );
};
