import React from "react";

import { Text } from "../../../infrastructure/typography/text.component.js";
import { Container } from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Spacer } from "../../spacers and globals/optimized.spacer.component.js";
import { Size_Options_CTA } from "../../ctas/size_options.cta.js";

export const Product_Size_Options_Component = ({
  item = null,
  selectedVariantId,
  setSelectedVariantId,
  setSelectedImageIndex,
}) => {
  return (
    <Container
      width="100%"
      height="10%"
      align="center"
      direction="column"
      justify="flex-start"
      //   color={theme.colors.bg.screens_bg}
      color={"red"}
      onPress={() => null}
    >
      <Container
        width="100%"
        height="40%"
        // color={"lightblue"}
        color={theme.colors.bg.elements_bg}
        justify="flex-start"
        align="flex-start"
      >
        <Spacer position="top" size="medium" />
        <Spacer position="left" size="extraLarge">
          <Text variant="dm_sans_bold_18">Size options</Text>
        </Spacer>
      </Container>
      <Container
        width="100%"
        height="70%"
        color={"lightyellow"}
        justify="flex-start"
        align="flex-start"
      >
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          direction="row"
          align="center"
          justify="center"
          gap={12}
          marginTop={12}
        >
          {item.size_variants.map((variant) => {
            const isActive = selectedVariantId === variant.id;

            return (
              <Size_Options_CTA
                action={() => {
                  setSelectedVariantId(variant.id);
                  setSelectedImageIndex(0); // 👈 reset to first image of new size
                }}
                key={variant.id}
                isActive={isActive}
                sizeLabel={variant.sizeLabel}
              />
            );
          })}
        </Container>
      </Container>
    </Container>
  );
};
