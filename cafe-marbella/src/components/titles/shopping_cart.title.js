import React from "react";
import ArrowBackIcon from "../../../assets/my_icons/arrow_back_icon.svg";
import ExitIcon from "../../../assets/my_icons/exit_icon.svg";
import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";

export const Shopping_Cart_Title = ({}) => {
  return (
    <Container
      width="100%"
      height="15%"
      align="center"
      direction="column"
      justify="space-between"
      color={theme.colors.bg.elements_bg}
    >
      <Container
        width="100%"
        height="50%"
        // color={"red"}
        justify="center"
        align="flex-start"
        color={theme.colors.bg.elements_bg}
      >
        <Spacer position="left" size="large">
          <Spacer position="left" size="medium">
            <Text variant="dm_sans_bold_28">Shopping Cart</Text>
          </Spacer>
        </Spacer>
      </Container>
      <Container
        width="100%"
        height="50%"
        // color={"lightblue"}
        justify="flex-start"
        align="flex-start"
        color={theme.colors.bg.elements_bg}
      >
        <Spacer position="left" size="large">
          <Spacer position="left" size="medium">
            <Spacer position="left" size="small">
              <Text variant="dm_sans_bold_14">1 item</Text>
            </Spacer>
          </Spacer>
        </Spacer>
      </Container>
    </Container>
  );
};
