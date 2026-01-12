import React, { useContext } from "react";
import { View } from "react-native";

import { Text } from "../../infrastructure/typography/text.component.js";
import { Container } from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";
import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import DeliveryIcon from "../../../assets/my_icons/deliveryTruckIcon.svg";

export const Order_From_Backend_Tile = ({
  total,
  warehouse_name,
  warehouse_address,
  order_status,
  quantity,
}) => {
  console.log("ORDER INFO TILE - QUANTITY:", quantity);
  const { formatCentsToUSD } = useContext(GlobalContext);
  const formatted_currency = formatCentsToUSD;

  return (
    <>
      <Container
        width="95%"
        color="#E0E0E0"
        justify="flex-start"
        align="flex-start"
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
              <Text variant="dm_sans_bold_14">Order date:</Text>
              <Text variant="dm_sans_bold_14">Order number:</Text>
              <Text variant="dm_sans_bold_14">Order total:</Text>
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
              <Text variant="dm_sans_bold_14">November 15, 2025</Text>
              <Text variant="dm_sans_bold_14">CM-000001</Text>
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
            color="brown"
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
              variant="dm_sans_bold_14_white"
              color={theme.colors.text.success_text}
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
            <StoreIcon width={40} height={40} fill={"#000000"} />
          </Container>

          <Container
            width="80%"
            color="#E0E0E0"
            align="flex-start"
            padding_vertical="4px"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_14">Pick up since Nov 15, 2025</Text>
              <Text variant="dm_sans_regular_14">{warehouse_name}</Text>
              <Text variant="dm_sans_regular_14">{warehouse_address}</Text>
            </Spacer>
          </Container>
        </Container>
        {/* SECTION 4 (moved to the end) */}

        <View
          style={{
            width: 390,
            height: 10,
            backgroundColor: "brown",
            marginTop: 8,
            borderWidth: 1,
            borderColor: "black",
            alignSelf: "stretch",
          }}
        />
      </Container>
    </>
  );
};
