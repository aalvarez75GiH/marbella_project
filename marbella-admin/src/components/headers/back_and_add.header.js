import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";

import ArrowBackIcon from "../../../assets/my_icons/arrow_back_icon.svg";
import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Back_And_Add_Header = ({
  action_1,
  action_2,
  hide_icon = false,
  caption = "",
}) => {
  return (
    <Container
      width="100%"
      height="8%"
      align="center"
      direction="row"
      justify={hide_icon ? "space-between" : "center"}
      color={theme.colors.bg.elements_bg}
    >
      {!hide_icon && (
        <Action_Container
          width="20%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          // color={"red"}
          onPress={action_1}
        >
          <ArrowBackIcon width={30} height={30} fill={"#000000"} />
        </Action_Container>
      )}

      <Container
        width="70%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        // color={"blue"}
        justify="center"
        align="center"
        style={{ paddingRight: "5%" }}
      >
        <Text variant="dm_sans_bold_18">{caption}</Text>
      </Container>
      <Action_Container
        width="15%"
        height="100%"
        justify="center"
        align="flex-start"
        color={theme.colors.bg.elements_bg}
        // color={"yellow"}
        onPress={action_2}
      >
        <Image
          source={require("../../../assets/my_icons/thick_add_icon.png")}
          style={{ width: 30, height: 30 }}
        />
      </Action_Container>
    </Container>
  );
};
