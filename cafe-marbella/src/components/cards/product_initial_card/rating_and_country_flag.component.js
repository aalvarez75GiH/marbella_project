import React from "react";

import { Text } from "../../../infrastructure/typography/text.component.js";
import { Container } from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Spacer } from "../../../components/spacers and globals/optimized.spacer.component.js";
import StarIcon from "../../../../assets/my_icons/star_icon.svg";

export const Rating_And_Country_Flag_Component = ({
  rating = "4.5",
  FlagImage,
}) => {
  return (
    <Container
      width="100%"
      height="10%"
      color={theme.colors.bg.elements_bg}
      // color={"lightblue"}
      justify="space-between"
      align="center"
      direction="row"
    >
      <Container
        width="20%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        // color={"blue"}
        justify="center"
        align="center"
        direction="row"
      >
        <StarIcon width={30} height={22} />
        <Spacer position="left" size="medium" />
        <Text variant="raleway_bold_16">{rating}</Text>
      </Container>
      <Container
        width="15%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        // color={"blue"}
        justify="center"
        align="center"
      >
        <FlagImage width={40} height={35} />
      </Container>
    </Container>
  );
};
