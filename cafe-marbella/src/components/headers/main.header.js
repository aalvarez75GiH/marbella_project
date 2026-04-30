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
  label = "Explore coffee",
  subtitle = "Ground · Whole · Green",
  hide_icon = false,
}) => {
  return (
    <Container
      width="92%"
      height="8%"
      align="center"
      direction="row"
      justify="center"
      color={theme.colors.bg.elements_bg}
      style={{
        paddingHorizontal: 16,
        paddingTop: 8,
      }}
    >
      {!hide_icon && (
        <Action_Container
          width="15%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          onPress={action_1}
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Image
            source={require("../../../assets/brand_images/isoLogo_black.png")}
            style={{
              width: 44,
              height: 44,
            }}
            resizeMode="contain"
          />
        </Action_Container>
      )}

      <Container
        width={hide_icon ? "85%" : "70%"}
        height="100%"
        color={theme.colors.bg.elements_bg}
        justify="center"
        align="center"
      >
        <Text variant="dm_sans_bold_20">{label}</Text>

        {!!subtitle && (
          <Text
            variant="dm_sans_regular_14"
            style={{
              marginTop: 4,
              color: theme.colors.text.secondary || "#3A2A22",
              letterSpacing: 0.3,
            }}
          >
            {subtitle}
          </Text>
        )}
      </Container>

      <Action_Container
        width="15%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        onPress={action_2}
        style={{
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <MenuIcon width={32} height={32} fill="#000000" />
      </Action_Container>
    </Container>
  );
};
