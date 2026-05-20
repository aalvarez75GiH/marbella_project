import React, { useContext } from "react";
import { View, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Action_Container,
  Container,
} from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";
import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import DeliveryIcon from "../../../assets/my_icons/deliveryTruckIcon.svg";

export const My_Orders_Tile = ({
  total,
  warehouse_name,
  warehouse_address,
  order_status,
  long_formatted_date,
  short_formatted_date,
  delivery_type,
  order_number,
  item,
}) => {
  const { formatCentsToUSD, formatDate } = useContext(GlobalContext);
  const formatted_currency = formatCentsToUSD;
  const { order_delivery_address, shipping_rate } = item || {};
  const { estimated_delivery_date } = shipping_rate || {};
  const iOs = Platform.OS === "ios";
  const { t } = useTranslation();

  const translatedStatus =
    order_status === "In Progress"
      ? t("orders.orders_tile.status.in_progress")
      : order_status === "Finished"
      ? t("orders.orders_tile.status.finished")
      : t("orders.orders_tile.status.refunded");

  let short_date = "";
  if (delivery_type === "delivery" && estimated_delivery_date) {
    short_date = formatDate(estimated_delivery_date).short;
    console.log(
      "ORDER INFO TILE - ESTIMATED DELIVERY DATE FORMATTED:",
      short_date
    );
  }

  const navigation = useNavigation();
  return delivery_type === "pickup" ? (
    <>
      <Action_Container
        width="95%"
        color="#E0E0E0"
        justify="flex-start"
        align="flex-start"
        onPress={() =>
          navigation.navigate("Order_View", {
            order: item,
          })
        }
      >
        {/* SECTION 1 */}
        <Container
          padding_vertical="12px"
          padding_horizontal="12px"
          width="100%"
          color="#E0E0E0"
          // color="red"
          direction="row"
          justify="center"
          align="center"
        >
          <Container
            width="40%"
            color="#E0E0E0"
            justify="center"
            align="flex-start"
            padding_vertical="4px"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_14">
                {t("orders.orders_tile.date")}
              </Text>
              <Text variant="dm_sans_bold_14">
                {t("orders.orders_tile.order_number")}
              </Text>
              <Text variant="dm_sans_bold_14">
                {t("orders.orders_tile.total")}
              </Text>
            </Spacer>
          </Container>

          <Container
            width="60%"
            color="#E0E0E0"
            justify="center"
            align="flex-start"
            padding_vertical="4px"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_14">{long_formatted_date}</Text>
              <Text variant="dm_sans_bold_14">{order_number}</Text>
              <Text variant="dm_sans_bold_14">{formatted_currency(total)}</Text>
            </Spacer>
          </Container>
        </Container>

        {/* SECTION 2 */}
        <Container
          width="100%"
          direction="row"
          padding_vertical="16px"
          justify="flex-end"
          color="#E0E0E0"
        >
          <Container
            width="30%"
            color={
              order_status === "In Progress"
                ? theme.colors.status_orders.inProgress
                : order_status === "Finished"
                ? theme.colors.ui.primary
                : theme.colors.ui.error
            }
            // color="red"
            padding_vertical="10px"
            style={{
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 20,
              minHeight: 28,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Text
              variant={
                order_status === "Refunded" || order_status === "Finished"
                  ? "dm_sans_bold_14_white"
                  : "dm_sans_bold_14"
              }
            >
              {translatedStatus}
            </Text>
          </Container>
        </Container>

        {/* SECTION 3 */}
        <Container
          width="100%"
          color="#E0E0E0"
          direction="row"
          padding_vertical="10px"
          style={{ alignItems: "center" }}
        >
          <Container
            width="20%"
            color="#E0E0E0"
            style={{
              minHeight: 44,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StoreIcon width={40} height={40} fill={"#000000"} />
          </Container>

          <Container
            width="80%"
            color="#E0E0E0"
            align="flex-start"
            padding_vertical="4px"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_14">
                {t("orders.orders_tile.pickup_since", {
                  short_formatted_date: short_formatted_date,
                })}
              </Text>
              <Text variant="dm_sans_regular_14">{warehouse_name}</Text>
              <Text variant="dm_sans_regular_14">{warehouse_address}</Text>
            </Spacer>
          </Container>
        </Container>
        {/* SECTION 4 (moved to the end) */}

        <Container
          // width="390"
          width={iOs ? "390px" : "410px"}
          height="10px"
          color={
            order_status === "In Progress"
              ? theme.colors.status_orders.inProgress
              : order_status === "Finished"
              ? theme.colors.ui.primary
              : theme.colors.ui.error
          }
          margin_top="8px"
          // border_width="1px"
          // border_color="black"
          align="stretch"
        ></Container>
      </Action_Container>
    </>
  ) : (
    <>
      <Action_Container
        width="95%"
        color="#E0E0E0"
        justify="flex-start"
        align="flex-start"
        onPress={() =>
          navigation.navigate("Order_View", {
            order: item,
          })
        }
      >
        {/* SECTION 1 */}
        <Container
          padding_vertical="12px"
          padding_horizontal="12px"
          width="100%"
          color="#E0E0E0"
          direction="row"
          justify="center"
          align="center"
        >
          <Container
            width="40%"
            color="#E0E0E0"
            justify="center"
            align="flex-start"
            padding_vertical="4px"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_14">
                {t("orders.orders_tile.date")}
              </Text>
              <Text variant="dm_sans_bold_14">
                {t("orders.orders_tile.order_number")}
              </Text>
              <Text variant="dm_sans_bold_14">
                {t("orders.orders_tile.total")}
              </Text>
            </Spacer>
          </Container>

          <Container
            width="60%"
            color="#E0E0E0"
            justify="center"
            align="flex-start"
            padding_vertical="4px"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_14">{long_formatted_date}</Text>
              <Text variant="dm_sans_bold_14">{order_number}</Text>
              <Text variant="dm_sans_bold_14">{formatted_currency(total)}</Text>
            </Spacer>
          </Container>
        </Container>

        {/* SECTION 2 */}
        <Container
          width="100%"
          direction="row"
          padding_vertical="16px"
          justify="flex-end"
          color="#E0E0E0"
        >
          <Container
            width="30%"
            color={
              order_status === "In Progress"
                ? theme.colors.status_orders.inProgress
                : order_status === "Finished"
                ? theme.colors.ui.primary
                : theme.colors.ui.error
            }
            padding_vertical="10px"
            style={{
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 20,
              minHeight: 28,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Text
              variant={
                order_status === "Refunded" || order_status === "Finished"
                  ? "dm_sans_bold_14_white"
                  : "dm_sans_bold_14"
              }
              // color={theme.colors.text.success_text}
              color={
                order_status === "Refunded"
                  ? theme.colors.text.white
                  : theme.colors.text.black
              }
            >
              {order_status}
            </Text>
          </Container>
        </Container>

        {/* SECTION 3 */}
        <Container
          width="100%"
          color="#E0E0E0"
          direction="row"
          padding_vertical="10px"
          style={{ alignItems: "center" }}
        >
          <Container
            width="20%"
            color="#E0E0E0"
            style={{
              minHeight: 44,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DeliveryIcon width={35} height={35} fill={"#000000"} />
          </Container>

          <Container
            width="80%"
            color="#E0E0E0"
            align="flex-start"
            padding_vertical="4px"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_14">
                {t("orders.orders_tile.shipping_eta", {
                  short_date: short_date,
                })}{" "}
              </Text>
              <Text variant="dm_sans_regular_14">
                {t("orders.orders_tile.at")} {order_delivery_address} - more
                info...
              </Text>
            </Spacer>
          </Container>
        </Container>
        {/* SECTION 4 (moved to the end) */}
        <Container
          // width="390"
          width={iOs ? "390px" : "410px"}
          height="10px"
          color={
            order_status === "In Progress"
              ? theme.colors.status_orders.inProgress
              : order_status === "Finished"
              ? theme.colors.ui.primary
              : theme.colors.ui.error
          }
          margin_top="8px"
          // border_width="1px"
          // border_color="black"
          align="stretch"
        ></Container>
      </Action_Container>
    </>
  );
};
