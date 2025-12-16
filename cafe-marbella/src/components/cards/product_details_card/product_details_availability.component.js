import React from "react";

import { Text } from "../../../infrastructure/typography/text.component.js";
import { Container } from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";

export const Product_Details_Avail_Promotion_Component = ({
  qty,
  promotion,
}) => {
  return (
    <Container
      width="100%"
      color={qty <= 5 ? theme.colors.ui.business : theme.colors.ui.primary}
      align="center"
      justify="center"
      padding_vertical="16px"
    >
      {qty <= 5 && !promotion.active ? (
        <Text variant="raleway_bold_16" color={theme.colors.text.alerts}>
          Hurry! Only {qty} left in stock.
        </Text>
      ) : promotion.active ? (
        <Text variant="raleway_bold_16_white" color={theme.colors.text.alerts}>
          {promotion.description}
        </Text>
      ) : (
        <>
          <Text variant="raleway_bold_16_white" color={theme.colors.text.black}>
            {qty} Available in stock, you are lucky!
          </Text>
        </>
      )}
    </Container>
  );
};
