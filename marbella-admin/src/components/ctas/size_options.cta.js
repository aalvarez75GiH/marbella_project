import React from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import { Pressable_Container } from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Size_Options_CTA = ({ action, isActive, sizeLabel, disabled }) => {
  return (
    <Pressable_Container
      width="27%"
      border_radius={"10px"}
      justify="center"
      align="center"
      onPress={disabled ? null : () => action()} // Disable onPress if disabled is true
      color={
        disabled
          ? theme.colors.bg.screens_bg // Set to grey or a disabled color
          : isActive
          ? theme.colors.ui.primary
          : theme.colors.bg.screens_bg
      }
      padding_vertical="10px"
      border_color={"transparent"}
      style={{
        borderBottomWidth: disabled ? 0 : 2,
      }}
    >
      <Text
        variant={
          disabled
            ? "dm_sans_bold_16_cta_disabled" // Optional: Use a disabled text style
            : // Optional: Use a disabled text style
            isActive
            ? "dm_sans_bold_16_white"
            : "dm_sans_bold_16"
        }
      >
        {sizeLabel}
      </Text>
    </Pressable_Container>
  );
};
