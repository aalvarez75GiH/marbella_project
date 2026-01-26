import React from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";

import ChevronRightIcon from "../../../assets/my_icons/chevron-right.svg";

export const Menu_Tile = ({ caption = "Standard caption", action }) => {
  return (
    <Action_Container
      width="100%"
      padding_vertical="0%"
      //color={theme.colors.bg.elements_bg}
      color={"lightblue"}
      justify="center"
      align="centers"
      direction="row"
      onPress={action}
    >
      <Container
        width="90%"
        padding_vertical="4%"
        color={theme.colors.bg.elements_bg}
        // color={"yellow"}
        justify="center"
        align="flex-start"
      >
        <Spacer position="left" size="extraLarge">
          <Spacer position="left" size="large">
            <Text variant="raleway_bold_16">{caption}</Text>
          </Spacer>
        </Spacer>
      </Container>
      <Container
        width="10%"
        padding_vertical="4%"
        color={theme.colors.bg.elements_bg}
        // color={"blue"}
        justify="center"
        align="center"
      >
        <ChevronRightIcon
          width={20}
          height={20}
          // fill={theme.colors.text.primary}
        />
      </Container>
    </Action_Container>
  );
};
