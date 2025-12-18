import React, { useState } from "react";
import { ActivityIndicator } from "react-native";

import { Text } from "../../infrastructure/typography/text.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import { Spacer } from "../global_components/optimized.spacer.component";
import {
  Container,
  Action_Container,
} from "../global_components/containers/general_containers.js";
import { Squared_action_CTA_component } from "../calls_to_action/squared_action.cta.js";

export const Global_activity_indicator = ({ action, caption = "Wait..." }) => {
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
          width={"70%"}
          height={"88%"}
          justify="center"
          align="center"
          color={theme.colors.bg.screens_bg}
          // color={"red"}
          direction="column"
        >
          <ActivityIndicator size="small" color="#000000" />
          <Spacer position="top" size="extraLarge" />

          <Text variant="dm_sans_bold_16" style={{ textAlign: "center" }}>
            {caption}
          </Text>
        </Container>
      </Container>
    </>
  );
};
