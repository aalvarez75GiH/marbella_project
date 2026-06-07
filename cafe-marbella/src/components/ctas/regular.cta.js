import React from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import { Action_Container } from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";
import { ActivityIndicator } from "react-native-paper";

export const Regular_CTA = ({
  action,
  width,
  height,
  caption = "Click Me",
  caption_text_variant = "dm_sans_bold_16",
  border_radius,
  color = theme.colors.ui.secondary,
  border_width = "1px",
  border_color = theme.colors.ui.white,
  isDisabled = false,
  isLoading = false,
}) => {
  console.log("isDisabled:", isDisabled);
  return (
    <Action_Container
      width={width || "20%"}
      height={height || "5%"}
      border_radius={border_radius}
      justify="center"
      align="center"
      onPress={() => (isDisabled ? null : action())}
      color={isDisabled ? "#CCCCCC" : color}
      border_width={border_width}
      border_color={border_color}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.ui.white} />
      ) : (
        <Text variant={caption_text_variant}>{caption}</Text>
      )}
    </Action_Container>
  );
};
