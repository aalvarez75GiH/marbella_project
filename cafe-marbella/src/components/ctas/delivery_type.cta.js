import React from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { theme } from "../../infrastructure/theme/index.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";

export const Delivery_Type_CTA = ({
  action,
  width,
  height,
  color = theme.colors.ui.secondary,
  caption = "Pick up",
  caption_text_variant = "dm_sans_bold_16",
  border_radius = "0px",
  //   color = theme.colors.ui.secondary,
  type = "pickup",
  delivery_fee = "$5.00",
  Icon,
}) => {
  return type === "pickup" ? (
    <Action_Container
      width={width}
      height={height}
      color={color}
      border_radius={border_radius}
      justify="flex-start"
      overflow="hidden"
    >
      <Container width="100%" height="20%" color={color}></Container>
      <Container width="100%" height="60%" color={color}>
        <Text variant={caption_text_variant}>{caption}</Text>
        <Spacer position="top" size="medium" />
        {/* <StoreIcon width={50} height={50} fill={"white"} /> */}
        <Icon width={50} height={50} fill={"#FFFFFF"} />
      </Container>
    </Action_Container>
  ) : (
    <Action_Container
      width={width}
      height={height}
      color={color}
      border_radius={border_radius}
      justify="flex-start"
      overflow="hidden"
    >
      <Container
        width="100%"
        height="20%"
        color={color}
        overflow="hidden"
        justify="flex-end"
      >
        <Text variant="dm_sans_bold_14_white">+Add {delivery_fee}</Text>
      </Container>
      <Container width="100%" height="60%" color={color}>
        <Text variant="raleway_bold_18_white">{caption}</Text>
        <Spacer position="top" size="medium" />
        {/* <DeliveryTruckIcon width={50} height={50} fill={"#FFFFFF"} /> */}
        <Icon width={50} height={50} fill={"#FFFFFF"} />
      </Container>
    </Action_Container>
  );
};
