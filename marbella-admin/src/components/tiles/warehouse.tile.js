import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";

import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Action_Container,
  Container,
} from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import SuccessIcon from "../../../assets/my_icons/success_check.svg";

import { GlobalContext } from "../../infrastructure/services/global/global.context.js";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context.js";

export const Warehouse_Tile = ({ warehouse_name, warehouse_address, item }) => {
  const { warehouse_information, active } = item || {};
  const { email, phone, opening_time, closing_time } =
    warehouse_information || {};
  const { formatCentsToUSD } = useContext(GlobalContext);
  const formatted_currency = formatCentsToUSD;

  const { setWarehouseSelected } = useContext(WarehouseContext);
  const navigation = useNavigation();

  const active_text_variant = active
    ? "dm_sans_regular_14_white"
    : "dm_sans_regular_14";

  const active_bg_color = active
    ? theme.colors.ui.primary
    : theme.colors.bg.warehouse_tile;

  return (
    <>
      <Action_Container
        width="95%"
        height="220px"
        color={active_bg_color}
        justify="center"
        align="center"
        border_width="3px"
        border_color={active ? theme.colors.ui.primary : "transparent"}
        onPress={() => {
          setWarehouseSelected({
            warehouse_name: item?.warehouse_name || "",
            warehouse_id: item?.warehouse_id || "",
            active: item?.active ?? true,
            max_delivery_time: item?.max_delivery_time || 60,
            max_limit_delivery_ratio: item?.max_limit_delivery_ratio || 32186.8,
            max_limit_pickup_ratio: item?.max_limit_pickup_ratio || 32186.8,
            physical_address: item?.geo.formatted_address,
            geo: item?.geo || {},
            warehouse_information: {
              representative: item?.warehouse_information.representative,
              email: item?.warehouse_information.email,
              phone: item?.warehouse_information.phone,
              opening_time:
                item?.warehouse_information.opening_time || "08:00 AM",
              closing_time:
                item?.warehouse_information.closing_time || "08:00 PM",
            },
            inventory: item?.inventory || {},
            ship_from: item?.ship_from || { lat: 0, lng: 0 },
            shipping_information: {
              is_shipping_flat_rate_active:
                item?.shipping_information.is_shipping_flat_rate_active,
              shipping_flat_rate:
                item?.shipping_information.shipping_flat_rate || 0,
            },
          }),
            navigation.navigate("Warehouse_Details_View", {
              coming_from: "warehouse_tile",
            });
        }}
      >
        {/* SECTION 1 */}
        <Container
          width="100%"
          height="80%"
          color={active_bg_color}
          //color="green"
          direction="row"
          //   padding_vertical="10px"
          style={{ alignItems: "center" }}
        >
          <Container
            width="20%"
            height="100%"
            //color={active_bg_color}
            color="transparent"
            style={{
              minHeight: 44,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StoreIcon
              width={40}
              height={40}
              fill={active ? "#FFFFFF" : "#000000"}
            />
          </Container>

          <Container
            width="80%"
            height="100%"
            color="transparent"
            // color="red"
            align="flex-start"
            padding_vertical="4px"
            direction="column"
          >
            <Spacer position="left" size="large">
              <Text
                variant={active ? "dm_sans_bold_16_white" : "dm_sans_bold_16"}
              >
                {warehouse_name}
              </Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant={active_text_variant}>
                Address: {warehouse_address}
              </Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant={active_text_variant}>Email: {email}</Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant={active_text_variant}>Phone number: {phone}</Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant={active_text_variant}>Open at: {opening_time}</Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant={active_text_variant}>
                Close at: {closing_time}
              </Text>
            </Spacer>
          </Container>
        </Container>
        <Container
          width="100%"
          height="20%"
          color={"transparent"}
          align="center"
          justify="center"
          direction="row"
        >
          <Container
            width="50%"
            height="100%"
            color={"transparent"}
            align="flex-start"
            direction="row"
          ></Container>
          <Container
            width="50%"
            height="100%"
            color={"transparent"}
            align="flex-start"
            justify="center"
            direction="row"
          >
            <Text
              variant={active_text_variant}
              color={theme.colors.text.primary}
            >
              {active ? "Active" : "Not active"}
            </Text>
            {active && (
              <Spacer position="left" size="medium">
                <SuccessIcon
                  width={20}
                  height={20}
                  color={active ? "#FFFFFF" : theme.colors.ui.success}
                />
              </Spacer>
            )}
          </Container>
        </Container>
      </Action_Container>
    </>
  );
};
