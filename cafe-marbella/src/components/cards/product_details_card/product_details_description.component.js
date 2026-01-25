import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Text } from "../../../infrastructure/typography/text.component.js";
import { Container } from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";
import { Spacer } from "../../spacers and globals/optimized.spacer.component.js";
import { Regular_CTA } from "../../ctas/regular.cta.js";

export const Product_Details_Description_Component = ({ item = null }) => {
  const { description } = item || {};
  const navigation = useNavigation();
  return (
    <Container
      width="100%"
      justify="flex-start"
      align="center"
      color={theme.colors.ui.success}
      //   color={"red"}
      padding_vertical="4%"
    >
      <Container
        width="100%"
        // color={"lightblue"}
        color={theme.colors.ui.success}
        justify="flex-start"
        align="flex-start"
        padding_vertical="5%"
      >
        <Spacer position="left" size="large">
          <Text variant="raleway_medium_18_white">{description}</Text>
        </Spacer>
      </Container>

      <Spacer position="top" size="medium" />
      <Container
        width="100%"
        direction="row"
        align="flex-end"
        justify="center"
        style={{ marginTop: 12, flexWrap: "wrap", gap: 12 }} // ✅ wrap if many options
        color={theme.colors.ui.success}
        // color={"lightgreen"}
        padding_vertical={"3%"}
      >
        <Regular_CTA
          width={"40%"}
          height={"45px"}
          caption={"Specifications"}
          caption_text_variant={"raleway_bold_16_white"}
          color={theme.colors.ui.success}
          border_width={"1px"}
          border_color={theme.colors.ui.white}
          border_radius={"8px"}
          action={() =>
            navigation.navigate("Product_Specifications_View", {
              item: item,
            })
          }
        />
        <Regular_CTA
          width={"40%"}
          height={"45px"}
          caption={"Ingredients"}
          caption_text_variant={"raleway_bold_16_white"}
          color={theme.colors.ui.success}
          border_width={"1px"}
          border_color={theme.colors.ui.white}
          border_radius={"8px"}
          action={() => null}
        />
      </Container>
    </Container>
  );
};
