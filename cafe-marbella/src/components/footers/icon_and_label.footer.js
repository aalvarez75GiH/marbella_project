import React from "react";
import { Image } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { Container } from "../containers/general.containers.js";
import { Text } from "../../infrastructure/typography/text.component.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Icon_And_Caption_Footer = ({ caption, image_source }) => {
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <Container
      width="92%"
      height={60}
      color={theme.colors.bg.screens_bg}
      // color={"lightblue"}
      direction="row"
      align="center"
      justify="center"
      style={{
        marginBottom: tabBarHeight - 25,
      }}
    >
      <Container
        width="18%"
        height="100%"
        color={theme.colors.bg.screens_bg}
        align="center"
        justify="center"
      >
        <Image source={image_source} style={{ width: 30, height: 30 }} />
      </Container>

      <Container
        width="55%"
        height="100%"
        align="center"
        justify="center"
        color={theme.colors.bg.screens_bg}
      >
        <Text variant="raleway_bold_14_grey" style={{ color: "#6F7285" }}>
          {caption}
        </Text>
      </Container>
    </Container>
  );
};
