import React, { useContext } from "react";
import { Image } from "expo-image";

import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

const CARD_HEIGHT = 100; // ✅ pick the height you want
export const Roast_Type_Tile = ({
  roast_type,
  image_source,
  roast_caption,
  roast_description,
  action,
}) => {
  return (
    <>
      <Action_Container
        width="92%"
        style={{ height: CARD_HEIGHT }}
        color={theme.colors.bg.elements_bg}
        justify="flex-start"
        align="center"
        border_radius={"10px"}
        direction="row"
        overflow="hidden"
        onPress={action}
      >
        <Container
          width="30%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          //color={"lightblue"}
          justify="center"
          align="center"
          border_radius_top_left={"0px"}
          border_radius_bottom_left={"0px"}
        >
          <Image
            source={image_source}
            style={{
              width: "90%",
              height: "90%",
            }}
            contentFit="cover" // replaces resizeMode
            transition={300} // smooth fade-in
          />
        </Container>
        <Container
          width="70%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          // color={"lightgreen"}
          justify="center"
          align="flex-start"
          border_radius_top_left={"0px"}
          border_radius_bottom_left={"0px"}
        >
          <Spacer position="left" size="large">
            <Text variant="raleway_bold_18">{roast_caption}</Text>
          </Spacer>
          <Spacer position="top" size="small" />
          <Spacer position="left" size="large">
            <Text variant="raleway_bold_14_grey" style={{ color: "#8F91A2" }}>
              {roast_description}
            </Text>
          </Spacer>
        </Container>
      </Action_Container>
    </>
  );
};
