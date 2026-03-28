import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";

import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Action_Container,
  Container,
} from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";
import StoreIcon from "../../../assets/my_icons/storeIcon.svg";

export const Warehouse_Tile = ({ warehouse_name, warehouse_address, item }) => {
  console.log("WAREHOUSE INFO TILE:", item);
  const { warehouse_information } = item || {};
  const { email, phone, opening_time, closing_time } =
    warehouse_information || {};
  const { formatCentsToUSD } = useContext(GlobalContext);
  const formatted_currency = formatCentsToUSD;

  const navigation = useNavigation();

  return (
    <>
      <Action_Container
        width="95%"
        height="180px"
        // color="#E0E0E0"
        color="blue"
        justify="center"
        align="center"
        onPress={() => null}
        //   onPress={() =>
        //     navigation.navigate("Order_View", {
        //       order: item,
        //     })
        //   }
      >
        {/* SECTION 1 */}
        <Container
          width="100%"
          height="100%"
          color="#E0E0E0"
          //color="green"
          direction="row"
          //   padding_vertical="10px"
          style={{ alignItems: "center" }}
        >
          <Container
            width="20%"
            height="100%"
            color="#E0E0E0"
            //color="indigo"
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
            height="100%"
            color="#E0E0E0"
            // color="red"
            align="flex-start"
            padding_vertical="4px"
            direction="column"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_16">{warehouse_name}</Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_14">
                Address: {warehouse_address}
              </Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_14">Email: {email}</Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_14">Phone number: {phone}</Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_14">Open at: {opening_time}</Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_14">Close at: {closing_time}</Text>
            </Spacer>
          </Container>
        </Container>

        {/* SECTION 4 (moved to the end) */}

        {/* <Container
        width="390px"
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
      ></Container> */}
      </Action_Container>
    </>
  );
};
