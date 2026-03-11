import React from "react";
import { useNavigation } from "@react-navigation/native";

import ArrowBackIcon from "../../../assets/my_icons/arrow_back_icon.svg";
import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Go_Back_Header = ({ action, label = "" }) => {
  return (
    <Container
      width="100%"
      height="8%"
      align="center"
      direction="row"
      justify="center"
      color={theme.colors.bg.elements_bg}
    >
      <Action_Container
        width="12%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        // color={"red"}
        onPress={action}
      >
        <ArrowBackIcon width={30} height={30} fill={"#000000"} />
      </Action_Container>
      <Container
        width="80%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        justify="center"
        align="center"
        style={{ paddingRight: "5%" }}
      >
        <Text variant="dm_sans_bold_18">{label}</Text>
      </Container>
    </Container>
  );
};
