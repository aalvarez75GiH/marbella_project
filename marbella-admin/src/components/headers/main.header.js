import React from "react";
import { Image } from "react-native";

import MenuIcon from "../../../assets/my_icons/menu_icon.svg";
import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Main_Header = ({
  action_1,
  action_2,
  label = "",
  hide_icon = false,
}) => {
  return (
    <Container
      width="100%"
      height="8%"
      align="center"
      direction="row"
      justify={hide_icon ? "space-around" : "center"}
      color={theme.colors.bg.elements_bg}
    >
      {!hide_icon && (
        <Action_Container
          width="15%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          //color={"red"}
          onPress={action_1}
        >
          <Image
            source={require("../../../assets/brand_images/isoLogo_black.png")}
            style={{
              width: "100%", // control size here
              aspectRatio: 0.04, // keeps proportions (1 = square)
            }}
            resizeMode="contain"
          />
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
        <Text variant="dm_sans_bold_18">{label}</Text>
      </Container>
      <Action_Container
        width="15%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        // color={"red"}
        onPress={action_2}
      >
        <MenuIcon width={30} height={30} fill={"#000000"} />
      </Action_Container>
    </Container>
  );
};
