import React from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import { Pressable_Container } from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Size_Options_CTA = ({ action, isActive, key, sizeLabel }) => {
  return (
    <Pressable_Container
      width="27%"
      height="60%"
      border_radius={"10px"}
      key={key}
      justify="center"
      align="center"
      onPress={() => action()}
      color={isActive ? theme.colors.ui.secondary : theme.colors.bg.screens_bg}
    >
      <Text variant={isActive ? "dm_sans_bold_16_white" : "dm_sans_bold_16"}>
        {sizeLabel}
      </Text>
    </Pressable_Container>
  );
};
