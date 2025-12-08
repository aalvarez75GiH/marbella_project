import React from "react";
import ArrowBackIcon from "../../../assets/my_icons/arrow_back_icon.svg";
import ExitIcon from "../../../assets/my_icons/exit_icon.svg";
import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Exit_Header_With_Label = ({ action, label = "" }) => {
  return (
    <Container
      width="100%"
      height="8%"
      align="center"
      direction="row"
      justify="space-between"
      color={theme.colors.bg.elements_bg}
    >
      <Action_Container
        width="20%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        //color={"red"}
        onPress={action}
      >
        <ExitIcon width={20} height={20} fill={"#000000"} />
      </Action_Container>
      <Container
        width="60%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        //color={"blue"}
        justify="center"
        align="center"
        style={{ paddingRight: "5%" }}
      >
        <Text variant="dm_sans_bold_18">{label}</Text>
      </Container>
      <Container
        width="12%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        //color={"lightblue"}
        justify="center"
        align="center"
        style={{ paddingRight: "5%" }}
      ></Container>
    </Container>
  );
};
