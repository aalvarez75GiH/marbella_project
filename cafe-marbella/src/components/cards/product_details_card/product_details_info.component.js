import React from "react";
import { Image } from "react-native";

import { Text } from "../../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
  Pressable_Container,
} from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Spacer } from "../../../components/spacers and globals/optimized.spacer.component.js";

export const Product_Details_Info_Component = ({
  product_name,
  product_subtitle,
  size_variants,
  selectedVariantId,
  setSelectedVariantId,
  selectedVariant,
}) => {
  return (
    <Container
      width="100%"
      height="16%"
      color={theme.colors.bg.elements_bg}
      //   color={"lightgreen"}
      justify="center"
      align="flex-start"
      direction="row"
      justifyContent="center"
    >
      <Container
        width="100%"
        height="110px"
        color={theme.colors.bg.elements_bg}
        // color={"#CAD"}
        justify="flex-start"
        align="flex-start"
      >
        <Spacer position="top" size="large" />
        <Container
          width="100%"
          height="50%"
          direction="column"
          align="flex-start"
          justify="center"
          color={theme.colors.bg.elements_bg}
        >
          <Spacer position="left" size="large">
            <Text variant="raleway_bold_20">{product_name}</Text>
            <Text variant="raleway_bold_20">{product_subtitle}</Text>
          </Spacer>
        </Container>

        <Container
          width="100%"
          height="35%"
          color={theme.colors.bg.elements_bg}
          //color={"blue"}
          justify="flex-start"
          align="flex-start"
          direction="row"
        >
          <Spacer position="left" size="large">
            <Text variant="raleway_bold_20">{selectedVariant.sizeLabel}</Text>
          </Spacer>
          <Spacer position="left" size="medium" />
          <Container width="2px" height="25px" color="#000000" />
          <Spacer position="left" size="large" />
          <Text variant="raleway_bold_18">
            {selectedVariant.sizeLabel_ounces}
          </Text>
        </Container>
        {/* ********************************************* */}
        <Container
          width="100%"
          height="50%"
          color={theme.colors.bg.elements_bg}
          //   color={"blue"}
          justify="center"
          align="center"
          direction="row"
        >
          {/* <Spacer position="left" size="large"> */}
          <Container
            width="50%"
            height="100%"
            justify="center"
            align="flex-start"
            color={theme.colors.bg.elements_bg}
          >
            <Spacer position="left" size="large">
              <Text
                variant="dm_sans_bold_28"
                style={{
                  color: theme.colors.text.success,
                }}
              >
                {selectedVariant.price ? `$${selectedVariant.price}` : null}
              </Text>
            </Spacer>
          </Container>
          <Container
            width="50%"
            height="85%"
            justify="center"
            align="center"
            color={theme.colors.bg.elements_bg}
            // color="lightgreen"
          >
            <Pressable_Container
              width="65%"
              height="100%"
              border_radius={"30px"}
              color={theme.colors.ui.success}
            >
              <Text
                variant="dm_sans_bold_16_white"
                style={{
                  textDecorationLine: "underline",
                }}
              >
                Add to cart
              </Text>
            </Pressable_Container>
          </Container>
        </Container>
        {/* ********************************************* */}
      </Container>
    </Container>
  );
};
