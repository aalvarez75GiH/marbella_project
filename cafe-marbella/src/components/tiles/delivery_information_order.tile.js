import React, { useContext } from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import { Container } from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

import StoreIcon from "../../../assets/my_icons/storeIcon.svg";

export const Delivery_Information_Order_Tile = ({
  warehouse_name = "Warehouse",
  warehouse_address = `2159 West Broad st suite B{"\n"}Athens GA, 30606`,
  opening_time,
  closing_time,

  distance_to_warehouse_mi,
}) => {
  return (
    <>
      <Container width="100%" height="25%" color={theme.colors.bg.elements_bg}>
        <Container
          width="90%"
          height="100%"
          color={theme.colors.ui.tertiary}
          //color={"green"}
          justify="centers"
          align="center"
          border_radius="20px"
          direction="row"
          overflow="hidden"
        >
          <Container
            width="30%"
            height="95%"
            color={theme.colors.ui.tertiary}
            // color={"lightgreen"}
          >
            <StoreIcon width={60} height={60} fill={"#000000"} />
          </Container>
          <Container
            width="70%"
            height="95%"
            color={theme.colors.ui.tertiary}
            //   color={"lightblue"}
          >
            <Container
              width="100%"
              height="25%"
              justify="center"
              align="flex-start"
              color="transparent"
              //color={"lightblue"}
            >
              <Spacer position="left" size="large">
                <Text variant="dm_sans_bold_22">Pickup at</Text>
              </Spacer>
              <Spacer position="left" size="large">
                <Text variant="dm_sans_bold_14">{warehouse_name}</Text>
              </Spacer>
            </Container>

            <Container
              width="100%"
              height="28%"
              justify="center"
              align="flex-start"
              color="transparent"
              //color="yellow"
            >
              <Spacer position="left" size="large">
                <Text variant="dm_sans_regular_14">
                  {/* 2159 West Broad st suite B{"\n"}Athens GA, 30606 */}
                  {warehouse_address}
                </Text>
              </Spacer>
            </Container>
            <Spacer position="top" size="small" />
            <Container
              width="100%"
              height="10%"
              color="transparent"
              //color="purple"
              justify="center"
              align="flex-start"
            >
              <Spacer position="left" size="large">
                <Text variant="dm_sans_regular_14">
                  Between {opening_time} - {closing_time}
                </Text>
              </Spacer>
            </Container>
            <Container
              width="100%"
              color="transparent"
              //color="pink"
              height="15%"
              justify="center"
              align="flex-start"
            >
              <Spacer position="left" size="large">
                {/* <Text variant="dm_sans_regular_14">3.4 miles away</Text> */}
                <Text variant="dm_sans_regular_14">
                  {distance_to_warehouse_mi} away
                </Text>
              </Spacer>
            </Container>
          </Container>
        </Container>
      </Container>
    </>
  );
};
