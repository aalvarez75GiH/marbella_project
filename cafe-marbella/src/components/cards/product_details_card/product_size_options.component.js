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
      direction="column"
      justify="flex-start"
      align="center"
      color={theme.colors.bg.elements_bg}
      padding_vertical="16px"
    >
      <Container
        width="100%"
        // color={"lightblue"}
        color={theme.colors.bg.elements_bg}
        justify="flex-start"
        align="flex-start"
      >
        <Spacer position="left" size="extraLarge">
          <Text variant="dm_sans_bold_18">Size options</Text>
        </Spacer>
      </Container>
      <Spacer position="top" size="small" />
      <Container
        width="100%"
        direction="row"
        align="center"
        justify="center"
        style={{ marginTop: 12, flexWrap: "wrap", gap: 12 }} // ✅ wrap if many options
        color={theme.colors.bg.elements_bg}
      >
        {item.size_variants.map((variant) => {
          const isActive = selectedVariantId === variant.id;
          return (
            <Size_Options_CTA
              key={variant.id}
              isActive={isActive}
              sizeLabel={variant.sizeLabel}
              action={() => {
                setSelectedVariantId(variant.id);
                setSelectedImageIndex(0);
              }}
            />
          );
        })}
      </Container>
    </Container>
  );
};
