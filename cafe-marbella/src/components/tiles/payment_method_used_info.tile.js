import React, { useContext } from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import { Container } from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import DeliveryIcon from "../../../assets/my_icons/deliveryTruckIcon.svg";
import CreditCardIcon from "../../../assets/my_icons/creaditCardIcon.svg";

export const Payment_method_Info_Tile = ({ last_four = "242" }) => {
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
        // color={"pink"}
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
          color={theme.colors.ui.tertiary}
          // color={"lightgreen"}
        >
          <CreditCardIcon width={40} height={40} />
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
              <Text variant="dm_sans_bold_16">Payment method used</Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_14">
                Visa ending in {last_four}
              </Text>
            </Spacer>
          </Container>

          <Spacer position="top" size="small" />
        </Container>
      </Container>
    </Container>
  );
};
