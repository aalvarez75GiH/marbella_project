import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { Text } from "../../../infrastructure/typography/text.component.js";
import { Container } from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Spacer } from "../../../components/spacers and globals/optimized.spacer.component.js";

import { GlobalContext } from "../../../infrastructure/services/global/global.context.js";

export const Product_Initial_Info_Component = ({
  product_name,
  product_subtitle,
  size_variants,
}) => {
  const { getTranslatedField } = useContext(GlobalContext);
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const productNameText = getTranslatedField(product_name, lang);
  const productSubtitleText = getTranslatedField(product_subtitle, lang);

  return (
    <Container
      width="100%"
      height="15%"
      color={theme.colors.bg.elements_bg}
      // color={"lightgreen"}
      justify="center"
      align="center"
      direction="row"
    >
      <Container
        width="75%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        // color={"#CAD"}
        justify="flex-start"
        align="flex-start"
      >
        <Spacer position="top" size="large" />
        <Spacer position="left" size="large">
          <Text variant="raleway_bold_18">{productNameText}</Text>
          <Text variant="raleway_bold_18">{productSubtitleText}</Text>
        </Spacer>
      </Container>
      <Container
        width="25%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        // color="lightyellow"
        justify="center"
        align="center"
      ></Container>
    </Container>
  );
};
