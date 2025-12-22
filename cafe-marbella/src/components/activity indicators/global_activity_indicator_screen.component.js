import React from "react";
import { ActivityIndicator } from "react-native";

import { Text } from "../../infrastructure/typography/text.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { Container } from "../containers/general.containers.js";

export const Global_activity_indicator = ({
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
      >
        <Container
          width={caption_width}
          height={"88%"}
          justify="center"
          align="center"
          color={theme.colors.bg.screens_bg}
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
