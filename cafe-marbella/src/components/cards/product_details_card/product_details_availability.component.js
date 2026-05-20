import React from "react";
import { useTranslation } from "react-i18next";

import { Text } from "../../../infrastructure/typography/text.component.js";
import { Container } from "../../containers/general.containers.js";
import { theme } from "../../../infrastructure/theme/index.js";

export const Product_Details_Avail_Promotion_Component = ({
  promotion,
  stock,
}) => {
  const { t } = useTranslation();
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
          {t("product_details_view.details_card.stock_hurry_caption", {
            stock,
          })}
        </Text>
      ) : promotion.active ? (
        <Text variant="raleway_bold_16_white" color={theme.colors.text.alerts}>
          {promotion.description}
        </Text>
      ) : stock === 0 ? (
        <>
          <Text variant="raleway_bold_16" color={theme.colors.text.black}>
            {t("product_details_view.details_card.stock_sold_out_caption")}
          </Text>
        </>
      ) : (
        <>
          <Text variant="raleway_bold_16_white" color={theme.colors.text.black}>
            {t("product_details_view.details_card.stock_available_caption", {
              stock,
            })}
          </Text>
        </>
      )}
    </Container>
  );
};
