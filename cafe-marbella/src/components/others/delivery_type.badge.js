import React from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import { Container } from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Delivery_type_Badge = ({
  width,
  height,
  border_radius,
  border_color,
  border_width,
  caption,
  color,
  type = "pickup",
  caption_1 = "",
  caption_2 = "",
  caption_text_variant,
  caption_text_1_variant,
  caption_text_2_variant,
}) => {
  return type === "pickup" ? (
    <Container
      width="100%"
      height="15%"
      color={theme.colors.bg.elements_bg}
      //   color={"green"}
      justify="center"
      align="flex-start"
    >
      <Container
        width={width || "30%"}
        height={height || "60%"}
        border_radius={border_radius || "8px"}
        justify="center"
        align="center"
        color={color || theme.colors.ui.tertiary}
        // color={"green"}
        border_width={border_width || "3px"}
        margin_left="30px"
        border_color={border_color || theme.colors.ui.primary}
      >
        <Text variant={caption_text_variant}>{caption}</Text>
      </Container>
    </Container>
  ) : (
    <Container
      width="100%"
      height="15%"
      color={theme.colors.bg.elements_bg}
      justify="center"
      align="flex-start"
    >
      <Container
        margin_left="30px"
        width={width || "30%"}
        height={height || "60%"}
        border_radius={border_radius || "8px"}
        justify="center"
        align="center"
        color={color || theme.colors.ui.tertiary}
        border_width={border_width || "3px"}
        border_color={border_color || theme.colors.ui.primary}
      >
        <Text variant={caption_text_1_variant}>{caption_1}</Text>
        <Text variant={caption_text_2_variant}>{caption_2}</Text>
      </Container>
    </Container>
  );
};
