import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
export const Grind_Type_Header = ({ caption = "" }) => {
  return (
    <Container
      width="92%"
      padding_vertical="4%"
      color={theme.colors.bg.screens_bg}
      justify="flex-start"
      align="center"
      direction="row"
      overflow="hidden"
    >
      <Spacer position="left" size="large">
        <Text variant="raleway_bold_18">{caption}</Text>
      </Spacer>
    </Container>
  );
};
