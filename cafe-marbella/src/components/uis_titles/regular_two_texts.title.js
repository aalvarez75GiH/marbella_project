import React from "react";
import { useTheme } from "styled-components/native";

import { Container } from "../containers/general.containers";
import { Text } from "../../infrastructure/typography/text.component.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Regular_UI_Title = ({ main_title, secondary_title }) => {
  const theme = useTheme();

  return (
    <Container
      width="90%"
      height={"10%"}
      color={theme.colors.bg.screens_bg}
      //color={"green"}
      justify="center"
      align="center"
      direction="row"
    >
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.screens_bg}
        justify="center"
        align="flex-start"
      >
        <Spacer position="left" size="small">
          <Text variant="raleway_bold_18">{main_title}</Text>
        </Spacer>
        <Spacer position="top" size="small" />
        <Spacer position="left" size="small">
          <Text variant="raleway_bold_14_grey" style={{ color: "#6F7285" }}>
            {secondary_title}
          </Text>
        </Spacer>
      </Container>
    </Container>
  );
};
