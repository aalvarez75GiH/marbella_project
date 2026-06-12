import React from "react";

import {
  Action_Container,
  Container,
} from "../../components/containers/general.containers";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { theme } from "../../infrastructure/theme";
import { Checkbox } from "react-native-paper";

export const Detail_Navigation_Tile = ({
  action,
  main_caption,
  sub_caption,
  icon,
  last_one = false,
  highlighted = false,
}) => {
  return (
    <Action_Container
      width="95%"
      padding_vertical="25px"
      color={
        highlighted ? theme.colors.bg.screens_bg : theme.colors.bg.screens_bg
      }
      justify="center"
      align="flex-start"
      direction="row"
      onPress={action}
      style={{
        marginBottom: last_one ? 70 : 0,
      }}
      border_width={highlighted ? "2px" : "0px"}
      border_color={highlighted ? theme.colors.ui.primary : "transparent"}
      border_radius="10px"
    >
      <Container
        width="75%"
        style={{ alignSelf: "stretch" }}
        color={
          highlighted ? theme.colors.bg.screens_bg : theme.colors.bg.screens_bg
        }
        justify="center"
        align="flex-start"
      >
        <Spacer position="left" size="large">
          <Text variant={highlighted ? "raleway_bold_18" : "raleway_bold_18"}>
            {main_caption}
          </Text>
        </Spacer>

        {!!sub_caption && (
          <Spacer position="left" size="large">
            <Text
              variant={
                highlighted ? "raleway_bold_14_grey" : "raleway_bold_14_grey"
              }
            >
              {sub_caption}
            </Text>
          </Spacer>
        )}
      </Container>

      <Container
        width="25%"
        style={{ alignSelf: "stretch" }}
        color={
          highlighted ? theme.colors.bg.screens_bg : theme.colors.bg.screens_bg
        }
        justify="center"
        align="flex-end"
      >
        <Spacer position="right" size="large">
          {icon}
        </Spacer>
      </Container>
    </Action_Container>
  );
};
