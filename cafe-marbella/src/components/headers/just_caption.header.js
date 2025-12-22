import React from "react";
import { useNavigation } from "@react-navigation/native";

import ArrowBackIcon from "../../../assets/my_icons/arrow_back_icon.svg";
import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Just_Caption_Header = ({
  caption = "",
  color = theme.colors.bg.elements_bg,
}) => {
  return (
    <Container
      width="100%"
      height="10%"
      color={color}
      //   color={"green"}
      justify="center"
      align="center"
    >
      <Text variant="raleway_bold_20">{caption}</Text>
    </Container>
  );
};
