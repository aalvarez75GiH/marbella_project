import React from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import { Action_Container } from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Underlined_CTA = ({
  action,
  width,
  height,
  caption = "Click Me",
  caption_text_variant = "dm_sans_bold_16",
  border_radius = "0px",
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
      border_color={border_color}
      //   style={{
      //     borderBottomWidth: 1, // 👈 underline thickness
      //     borderBottomColor: border_color || "#000",
      //   }}
    >
      <Text
        variant={caption_text_variant}
        style={{
          textDecorationLine: "underline",
        }}
      >
        {caption}
      </Text>
    </Action_Container>
  );
};
