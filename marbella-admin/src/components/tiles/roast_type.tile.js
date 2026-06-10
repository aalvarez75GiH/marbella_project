import React, { useContext } from "react";
import { Image } from "expo-image";
import { useTheme } from "styled-components/native";
import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import RightArrowIcon from "../../../assets/my_icons/chevron-right.svg";

const CARD_HEIGHT = 150; // ✅ pick the height you want
export const Roast_Type_Tile = ({
  roast_type,
  image_source,
  roast_caption,
  roast_description,
  action,
  roastTypeSelected,
}) => {
  const theme = useTheme();

  const ROAST_COLORS = {
    light: {
      border: theme.colors.roasts_borders.light, // "#F0C979",
      arrowBg: theme.colors.roastBackgrounds.light, // "#FFF6E8",
    },
    medium: {
      border: theme.colors.roasts_borders.medium, // "#D09042",
      arrowBg: theme.colors.roastBackgrounds.medium, // "#F7EFE6",
    },
    dark: {
      border: theme.colors.roasts_borders.dark, // "#6B412B",
      arrowBg: theme.colors.roastBackgrounds.dark, // "#EEE7E3",
    },
  };

  const isSelected = roastTypeSelected === roast_type;
  const colors = ROAST_COLORS[roast_type];

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
        border_color={isSelected ? colors.border : "transparent"}
        border_width={2}
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
          width="50%"
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
        <Container
          width="20%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          //color={"lightgreen"}
          justify="center"
          align="center"
          border_radius_top_left={"0px"}
          border_radius_bottom_left={"0px"}
        >
          <Spacer position="left" size="large">
            <Container
              width={45}
              height={45}
              border_radius={"30px"}
              align="center"
              justify="center"
              color={isSelected ? colors.arrowBg : theme.colors.bg.screens_bg}
            >
              <RightArrowIcon width={18} height={18} />
            </Container>
          </Spacer>
        </Container>
      </Action_Container>
    </>
  );
};
