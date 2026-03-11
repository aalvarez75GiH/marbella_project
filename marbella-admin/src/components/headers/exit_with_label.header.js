import React from "react";
import ExitIcon from "../../../assets/my_icons/exitIcon_2.svg";
import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";

export const Exit_Header_With_Label = ({
  action,
  label = "",
  orientation = "left", // "left" | "right"
}) => {
  const bg = theme.colors.bg.elements_bg;

  const ExitButton = (
    <Action_Container
      width="20%"
      height="100%"
      color={bg}
      onPress={action}
      accessibilityRole="button"
      accessibilityLabel="Exit"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <ExitIcon width={30} height={30} color="#000000" />
    </Action_Container>
  );

  const Spacer = <Container width="20%" height="100%" color={bg} />;

  return (
    <Container
      width="100%"
      height="8%"
      align="center"
      direction="row"
      justify="flex-start"
      color={bg}
    >
      {orientation === "left" ? ExitButton : Spacer}

      <Container
        width="60%"
        height="100%"
        color={bg}
        justify="center"
        align="center"
      >
        <Text variant="dm_sans_bold_18" numberOfLines={1}>
          {label}
        </Text>
      </Container>

      {orientation === "right" ? ExitButton : Spacer}
    </Container>
  );
};
