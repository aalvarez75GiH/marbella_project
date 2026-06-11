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
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";

export const Back_And_CTA_Header = ({
  action_1,
  action_2,
  hide_icon = false,
  showCTA = false,
  cta_caption,
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
          width="55%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          //color={"red"}
          onPress={action_1}
        >
          <Spacer position="left" size="extraLarge">
            <ArrowBackIcon width={30} height={30} fill={"#000000"} />
          </Spacer>
        </Action_Container>
      )}
      {hide_icon && (
        <Container
          width="15%"
          height="100%"
          color={theme.colors.bg.elements_bg}
        ></Container>
      )}

      <Container
        width="35%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        // color={"blue"}
        justify="center"
        align="center"
        style={{ paddingRight: "5%" }}
      ></Container>
      <Container
        width="55%"
        height="100%"
        justify="center"
        align="flex-start"
        color={theme.colors.bg.elements_bg}
        // color={"yellow"}
        onPress={action_2}
      >
        {showCTA ? (
          <Regular_CTA
            width="50%"
            height={40}
            color={theme.colors.ui.primary}
            border_radius={"40px"}
            caption={cta_caption}
            caption_text_variant="dm_sans_bold_16_white"
            action={action_2}
          />
        ) : null}
      </Container>
    </Container>
  );
};
