import React, { useContext } from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import { Container } from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import DeliveryIcon from "../../../assets/my_icons/deliveryTruckIcon.svg";

export const Refunded_Information_Order_Tile = ({
  delivery_type,
  order_number,
  updatedAt,
  refund_details,
}) => {
  const { formatDate } = useContext(GlobalContext);
  console.log("Delivery_Information_Order_Tile delivery_type:", delivery_type);

  return delivery_type === "pickup" ? (
    <Container
      width="100%"
      //   height="25%"
      color={theme.colors.bg.elements_bg}
      align="center"
    >
      <Container
        width="90%"
        color={theme.colors.ui.error}
        //color={"pink"}
        justify="centers"
        align="center"
        border_radius="20px"
        direction="row"
        overflow="hidden"
        padding_vertical="5%"
      >
        <Container
          width="30%"
          //   height="95%"
          color={theme.colors.ui.error}
          // color={"lightgreen"}
        >
          <StoreIcon width={60} height={60} fill={"#FFFFFF"} />
        </Container>
        <Container
          width="70%"
          color={theme.colors.ui.error}

          //   color={"lightblue"}
        >
          <Container
            width="100%"
            justify="center"
            align="flex-start"
            color="transparent"
            padding_vertical="3%"
            //color={"lightblue"}
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_16_white">
                This order was refunded!
              </Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_14_white">
                by {formatDate(updatedAt).short}
              </Text>
            </Spacer>
            <Spacer position="top" size="large" />
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_12_white">
                Order #: {order_number}
              </Text>
            </Spacer>
          </Container>

          <Spacer position="top" size="small" />
          <Container
            width="85%"
            color="transparent"
            // color="purple"
            justify="center"
            align="flex-start"
          >
            <Text variant="dm_sans_regular_14_white">
              Reason: {refund_details}
            </Text>
          </Container>
        </Container>
      </Container>
    </Container>
  ) : (
    <Container
      width="100%"
      //   height="25%"
      color={theme.colors.bg.elements_bg}
      align="center"
    >
      <Container
        width="90%"
        color={theme.colors.ui.error}
        //color={"pink"}
        justify="centers"
        align="center"
        border_radius="20px"
        direction="row"
        overflow="hidden"
        padding_vertical="5%"
      >
        <Container
          width="30%"
          //   height="95%"
          color={theme.colors.ui.error}
          // color={"lightgreen"}
        >
          <DeliveryIcon width={50} height={50} fill={"#FFFFFF"} />
        </Container>
        <Container
          width="70%"
          color={theme.colors.ui.error}

          //   color={"lightblue"}
        >
          <Container
            width="100%"
            justify="center"
            align="flex-start"
            color="transparent"
            padding_vertical="3%"
            //color={"lightblue"}
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_16_white">
                This order was refunded!
              </Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_14_white">
                by {formatDate(updatedAt).short}
              </Text>
            </Spacer>
            <Spacer position="top" size="large" />
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_12_white">
                Order #: {order_number}
              </Text>
            </Spacer>
          </Container>

          <Spacer position="top" size="small" />
          <Container
            width="85%"
            color="transparent"
            // color="purple"
            justify="center"
            align="flex-start"
          >
            <Text variant="dm_sans_regular_14_white">
              Reason: {refund_details}
            </Text>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
