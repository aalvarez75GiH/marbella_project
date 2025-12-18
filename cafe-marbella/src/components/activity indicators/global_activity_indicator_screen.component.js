import React, { useState } from "react";
import { ActivityIndicator } from "react-native";

import { Text } from "../../infrastructure/typography/text.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";

export const Global_activity_indicator = ({
  action,
  caption = "Wait...",
  caption_width = "45%",
}) => {
  return (
    <>
      <Container
        width={"100%"}
        height={"100%"}
        justify="space-between"
        align="center"
        color={theme.colors.bg.screens_bg}
        direction="column"
        // color={"green"}
      >
        <Container
          width={caption_width}
          height={"88%"}
          justify="center"
          align="center"
          color={theme.colors.bg.screens_bg}
          //color={"red"}
          direction="column"
        >
          <ActivityIndicator size="small" color="#000000" />
          <Spacer position="top" size="extraLarge" />

          <Text variant="raleway_bold_16" style={{ textAlign: "center" }}>
            {caption}
          </Text>
        </Container>
      </Container>
    </>
  );
};
