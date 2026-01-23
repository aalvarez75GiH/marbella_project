import React from "react";

import { Text } from "../../../infrastructure/typography/text.component.js";
import { Container } from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";

export const Product_Details_Avail_Promotion_Component = ({
  promotion,
  stock,
}) => {
  return (
    <Container
      width="100%"
      color={
        stock <= 5 && !promotion.active
          ? theme.colors.ui.business
          : promotion.active
          ? theme.colors.ui.primary
          : theme.colors.ui.success
      }
      align="center"
      justify="center"
      padding_vertical="16px"
    >
      {stock <= 5 && stock !== 0 && !promotion.active ? (
        <Text variant="raleway_bold_16" color={theme.colors.text.alerts}>
          Hurry! Only {stock} left in stock.
        </Text>
      ) : promotion.active ? (
        <Text variant="raleway_bold_16_white" color={theme.colors.text.alerts}>
          {promotion.description}
        </Text>
      ) : stock === 0 ? (
        <>
          <Text variant="raleway_bold_16" color={theme.colors.text.black}>
            Sorry this product size is sold out!
          </Text>
        </>
      ) : (
        <>
          <Text variant="raleway_bold_16_white" color={theme.colors.text.black}>
            {stock} Available in stock, you are lucky!
          </Text>
        </>
      )}
    </Container>
  );
};
