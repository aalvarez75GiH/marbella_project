import React from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Pressable_Container,
  Action_Container,
} from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Regular_CTA = ({
  action,
  width,
  height,
  caption = "Click Me",
  caption_text_variant,
  border_radius,
  color = theme.colors.ui.secondary,
  border_width = "1px",
  border_color = theme.colors.ui.white,
}) => {
  return (
    <Action_Container
      width={width || "20%"}
      height={height || "5%"}
      border_radius={border_radius}
      justify="center"
      align="center"
      onPress={() => action()}
      color={color}
      border_width={border_width}
      border_color={border_color}
    >
      <Text variant={caption_text_variant}>{caption}</Text>
    </Action_Container>
  );
};
