import React, { useContext } from "react";

import { Text } from "../../infrastructure/typography/text.component.js";
import { Container } from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import TimeIcon from "../../../assets/my_icons/time_icon.svg";
import DistanceIcon from "../../../assets/my_icons/distance_icon.svg";

export const Long_Distance_Warning_Tile = ({
  formatted_address,
  distance_time,
  distance_in_miles,
}) => {
  return (
    <>
      <Container
        width="95%"
        height="90%"
        // color="blue"
        color={theme.colors.ui.tertiary}
        justify="center"
        align="center"
        border_radius="10px"
        border_width="4px"
        border_color={theme.colors.ui.primary}
        overflow="hidden"
      >
        <Container
          width="100%"
          height="30%"
          //   color="blue"
          color={theme.colors.ui.tertiary}
          justify="center"
          align="center"
        >
          <Container
            width="90%"
            height="70%"
            color="brown"
            // color={theme.colors.ui.tertiary}
            justify="center"
            align="center"
            border_radius="10px"
          >
            <Text variant="dm_sans_bold_18_white">Long distance warning!!</Text>
          </Container>
        </Container>
        <Container
          width="100%"
          height="30%"
          color="yellow"
          // color={theme.colors.ui.tertiary}
          justify="center"
          align="center"
          direction="row"
        >
          <Container
            width="30%"
            height="100%"
            // color="pink"
            color={theme.colors.ui.tertiary}
            justify="center"
            align="center"
          >
            <StoreIcon width={"50%"} height={"50%"} />
          </Container>
          <Container
            width="70%"
            height="100%"
            //color="lightblue"
            color={theme.colors.ui.tertiary}
            justify="center"
            align="flex-start"
          >
            <Text variant="dm_sans_bold_16">Our nearest store</Text>
            <Text variant="dm_sans_regular_16">{formatted_address}</Text>
          </Container>
        </Container>
        <Spacer position="top" size="medium" />
        <Container
          width="85%"
          height="0.5%"
          // color="blue"
          color={"#8E8E93"}
          justify="center"
          align="center"
        />
        <Container
          width="100%"
          height="40%"
          //   color="pink"
          color={theme.colors.ui.tertiary}
          justify="center"
          align="center"
          direction="row"
        >
          <Container
            width="50%"
            height="100%"
            //color="pink"
            color={theme.colors.ui.tertiary}
            justify="center"
            align="center"
            // border_width="1px"
            // border_color={"#000000"}
          >
            <Container
              width="100%"
              height="35%"
              //color="pink"
              color={theme.colors.ui.tertiary}
              justify="center"
              align="center"
              //   border_width="1px"
              //   border_color={"#000000"}
              direction="row"
            >
              <TimeIcon width={25} height={25} />
              <Spacer position="left" size="large">
                <Text variant="dm_sans_bold_14">Distance Time:</Text>
              </Spacer>
            </Container>
            <Container
              width="100%"
              height="25%"
              //color="blue "
              color={theme.colors.ui.tertiary}
              justify="center"
              align="center"
              //   border_width="1px"
              //   border_color={"#000000"}
              direction="row"
            >
              <Container
                width="20%"
                height="100%"
                //color="blue "
                color={theme.colors.ui.tertiary}
                justify="center"
                align="center"
                // border_width="1px"
                // border_color={"#000000"}
              ></Container>
              <Container
                width="80%"
                height="100%"
                //color="blue "
                color={theme.colors.ui.tertiary}
                justify="center"
                align="center"
                // border_width="1px"
                // border_color={"#000000"}
              >
                <Spacer position="left" size="large">
                  <Text variant="dm_sans_bold_18">{distance_time}</Text>
                </Spacer>
                <Spacer position="bottom" size="small" />
              </Container>
            </Container>
          </Container>
          <Container
            width="50%"
            height="100%"
            // color="pink"
            color={theme.colors.ui.tertiary}
            justify="center"
            align="center"
            // border_width="1px"
            // border_color={"#000000"}
          >
            <Container
              width="100%"
              height="35%"
              //color="pink"
              color={theme.colors.ui.tertiary}
              justify="center"
              align="center"
              //   border_width="1px"
              //   border_color={"#000000"}
              direction="row"
              margin_right="20%"
            >
              <DistanceIcon width={30} height={30} />
              <Spacer position="left" size="large">
                <Text variant="dm_sans_bold_14">Distance:</Text>
              </Spacer>
            </Container>
            <Container
              width="100%"
              height="25%"
              //   color="blue "
              color={theme.colors.ui.tertiary}
              justify="center"
              align="center"
              //   border_width="1px"
              //   border_color={"#000000"}
              direction="row"
              margin_right="20%"
            >
              <Container
                width="30%"
                height="100%"
                //color="blue "
                color={theme.colors.ui.tertiary}
                justify="center"
                align="center"
                // border_width="1px"
                // border_color={"#000000"}
              ></Container>
              <Container
                width="70%"
                height="100%"
                // color="blue "
                color={theme.colors.ui.tertiary}
                justify="center"
                align="center"
                // border_width="1px"
                // border_color={"#000000"}
              >
                <Spacer position="left" size="large">
                  <Text variant="dm_sans_bold_18_red">{distance_in_miles}</Text>
                </Spacer>
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>
    </>
  );
};
