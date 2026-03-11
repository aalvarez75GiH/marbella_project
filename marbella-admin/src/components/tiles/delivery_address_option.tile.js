import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

import {
  Action_Container,
  Container,
} from "../../components/containers/general.containers";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";

import LocationIcon from "../../../assets/my_icons/distance_icon.svg";
import AddIcon from "../../../assets/my_icons/addIcon.svg";

export const Delivery_Address_Option_Tile = ({
  address_option,
  customer_address,
  action,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  return address_option === "current_address" ? (
    <>
      <Action_Container
        padding_vertical="5%"
        width="95%"
        color={theme.colors.ui.tertiary}
        // color={"green"}
        justify="centers"
        align="center"
        // border_radius="20px"
        direction="row"
        overflow="hidden"
        onPress={action}
      >
        <Container
          padding_vertical="5%"
          width="20%"
          color={theme.colors.ui.tertiary}
          // color={"lightgreen"}
        >
          {/* <StoreIcon width={60} height={60} fill={"#000000"} /> */}
          <LocationIcon width={40} height={40} fill={"#000000"} />
        </Container>
        <Container
          width="70%"
          color={theme.colors.ui.tertiary}
          //   color={"lightblue"}
        >
          <Container
            width="100%"
            justify="center"
            padding_vertical="3%"
            align="flex-start"
            color="transparent"
            //color={"lightblue"}
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_18">Your current address:</Text>
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
              <Text variant="dm_sans_regular_14">{customer_address}</Text>
            </Spacer>
          </Container>
          <Spacer position="top" size="small" />
        </Container>
      </Action_Container>
      <Spacer position="top" size="medium" />
    </>
  ) : (
    <>
      <Action_Container
        padding_vertical="5%"
        width="95%"
        color={theme.colors.ui.tertiary}
        // color={"green"}
        justify="centers"
        align="center"
        // border_radius="20px"
        direction="row"
        overflow="hidden"
        onPress={action}
      >
        <Container
          padding_vertical="5%"
          width="20%"
          color={theme.colors.ui.tertiary}
          // color={"lightgreen"}
        >
          <AddIcon width={40} height={40} fill={"#000000"} />
        </Container>
        <Container
          width="70%"
          color={theme.colors.ui.tertiary}
          //   color={"lightblue"}
        >
          <Container
            width="100%"
            justify="center"
            padding_vertical="3%"
            align="flex-start"
            color="transparent"
            //color={"lightblue"}
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_18">
                Add a different delivery address
              </Text>
            </Spacer>
          </Container>

          <Spacer position="top" size="small" />
        </Container>
      </Action_Container>
    </>
  );
};
