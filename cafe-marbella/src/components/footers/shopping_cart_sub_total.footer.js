import React from "react";

import { Container } from "../containers/general.containers.js";
import { Text } from "../../infrastructure/typography/text.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component.js";

export const Shopping_Cart_Sub_Total_Footer = ({ sub_total }) => {
  return (
    <Container
      width="95%"
      height="10%"
      color={theme.colors.bg.elements_bg}
      // color={"lightgreen"}
      direction="row"
      border_radius="20px"
      overflow="hidden"
    >
      <Container
        width="50%"
        height="100%"
        // color="red"
        color={theme.colors.bg.elements_bg}
        justify="flex-start"
        align="flex-start"
      >
        <Spacer position="top" size="medium" />
        <Spacer position="left" size="large">
          <Text variant="dm_sans_bold_20">Sub total:</Text>
        </Spacer>
      </Container>
      <Container
        width="50%"
        height="100%"
        // color="lightblue"
        justify="center"
        align="flex-end"
        color={theme.colors.bg.elements_bg}
      >
        <Spacer position="right" size="large">
          <Text variant="dm_sans_bold_20">${sub_total}</Text>
        </Spacer>
        <Spacer position="right" size="large">
          <Text
            variant="dm_sans_bold_14"
            style={{
              color: "#7A7A7A",
            }}
          >
            (fees not included)
          </Text>
        </Spacer>
      </Container>
    </Container>
  );
};
