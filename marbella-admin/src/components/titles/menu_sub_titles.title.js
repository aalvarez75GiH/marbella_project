import React from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import { Container } from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";

export const Menu_Sub_Title_Title = ({ label = "Menu label" }) => {
  return (
    <Container
      width="100%"
      padding_vertical="5%"
      color={theme.colors.bg.elements_bg}
      //   color={"red"}
      justify="center"
      align="flex-start"
    >
      <Spacer position="left" size="extraLarge">
        <Text variant="raleway_bold_20">{label}</Text>
      </Spacer>
    </Container>
  );
};
