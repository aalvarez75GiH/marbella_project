import React, { useContext } from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import AccountIcon from "../../../assets/my_icons/accountIcon.svg";

export const Switching_Accounts_Tile = ({ email, display_name, action }) => {
  return (
    <>
      <Action_Container
        width="100%"
        padding_vertical={"5%"}
        // height="25%"
        color={theme.colors.bg.elements_bg}
        direction="row"
        border_radius="10px"
        overflow="hidden"
        onPress={action}
      >
        <Container
          width="10%"
          padding_vertical={"5%"}
          //   height="100%"
          color={theme.colors.bg.elements_bg}
        >
          <AccountIcon width={25} height={25} />
        </Container>
        <Container
          width="80%"
          //   height="100%"
          // color="yellow"
          color={theme.colors.bg.elements_bg}
          justify="center"
          align="flex-start"
          border_radius="10px"
        >
          <Spacer position="left" size="medium">
            <Text variant="dm_sans_bold_16">{display_name}</Text>
            <Text variant="dm_sans_bold_16">{email}</Text>
          </Spacer>
        </Container>
      </Action_Container>
    </>
  );
};
