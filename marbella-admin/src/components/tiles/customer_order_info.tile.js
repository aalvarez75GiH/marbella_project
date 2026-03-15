import React from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import { Container } from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";

import AccountIcon from "../../../assets/my_icons/accountIcon.svg";

export const Customer_Order_Info_Tile = ({ customer, order_number }) => {
  const { first_name, last_name, customer_address, phone_number } =
    customer || {};

  console.log("customer inside tile:", JSON.stringify(customer, null, 2));

  return (
    <Container
      width="100%"
      //   height="25%"
      color={theme.colors.bg.elements_bg}
      align="center"
    >
      <Container
        width="90%"
        color={theme.colors.ui.tertiary}
        //color={"pink"}
        justify="centers"
        align="center"
        border_radius="20px"
        direction="row"
        overflow="hidden"
        padding_vertical="5%"
      >
        <Container width="30%" color={theme.colors.ui.tertiary}>
          <AccountIcon width={40} height={40} fill={"#000000"} />
        </Container>
        <Container
          width="70%"
          color={theme.colors.ui.tertiary}
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
              <Text variant="dm_sans_bold_22">Customer info</Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_16">
                {first_name} {""} {last_name}
              </Text>
            </Spacer>
          </Container>

          <Container
            width="100%"
            justify="center"
            align="flex-start"
            color="transparent"

            //color="yellow"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_14">
                {/* 2159 West Broad st suite B{"\n"}Athens GA, 30606 */}
                {customer_address}
              </Text>
            </Spacer>
          </Container>
          <Spacer position="top" size="small" />
          <Container
            width="100%"
            color="transparent"
            //color="purple"
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_14">Phone: {phone_number}</Text>
            </Spacer>
          </Container>
          <Spacer position="top" size="small" />
          <Container
            width="100%"
            color="transparent"
            //color="purple"
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_14">Order #: {order_number}</Text>
            </Spacer>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
