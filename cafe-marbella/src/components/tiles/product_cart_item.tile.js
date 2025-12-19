import React, { useContext } from "react";
import { FlatList, Image } from "react-native";
import { useTheme } from "styled-components/native";

import {
  Action_Container,
  Container,
} from "../../components/containers/general.containers";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import RemoveIcon from "../../../assets/my_icons/remove_icon.svg";
import { Text } from "../../infrastructure/typography/text.component";

import { CartContext } from "../../infrastructure/services/cart/cart.context";

export const Product_Cart_Item_Tile = ({ image }) => {
  const theme = useTheme();

  return (
    <>
      <Container
        // width="95%"
        width="390px"
        //height="70%"
        height="240px"
        // color="red"
        color={theme.colors.ui.secondary}
        direction="row"
        overflow="hidden"
        border_radius="20px"
      >
        <Container
          width="30%"
          height="100%"
          //color="blue"
          color={theme.colors.ui.secondary}
          // border_radius="20px"
        >
          <Image
            // source={images[item.image]}
            source={image}
            style={{
              width: "65%",
              height: "65%",
              resizeMode: "contain", // Ensures the image fits without distortion
            }}
          />
        </Container>
        <Container width="0.3%" height="80%" color={"#898989"} />
        <Container
          width="70%"
          height="100%"
          color="lightblue"
          justify="flex-start"
        >
          <Container width="100%" height="15%" color="green" direction="row">
            <Container
              width="80%"
              height="100%"
              // color="yellow"
              color={theme.colors.ui.secondary}
            ></Container>
            <Container
              width="20%"
              height="100%"
              // color="orange"
              color={theme.colors.ui.secondary}
              justify="flex-end"
              align="center"
            >
              <RemoveIcon width={20} height={20} fill={"#FFFFFF"} />
            </Container>
          </Container>
          <Container
            width="100%"
            height="40%"
            //color={theme.colors.ui.secondary}
            direction="row"
            color="purple"
          >
            <Container
              width="70%"
              height="100%"
              color={theme.colors.ui.secondary}
              //color={"yellow"}
              justify="center"
              align="flex-start"
            >
              <Spacer position="left" size="large">
                <Text variant="raleway_bold_14_white">Cafe Marbella</Text>
                <Text variant="raleway_bold_24_white">Venezuela</Text>
                <Text variant="raleway_bold_14_white">Ground bean coffee</Text>
                <Text variant="raleway_bold_14_white">250 gr - 8 oz</Text>
              </Spacer>
            </Container>
            <Container
              width="30%"
              height="100%"
              color={theme.colors.ui.secondary}
              //color={"yellow"}
            ></Container>
          </Container>
          <Container
            width="100%"
            height="50%"
            //color="blue"
            direction="row"
            color={theme.colors.ui.secondary}
          >
            <Container
              width="50%"
              height="60%"
              color={theme.colors.ui.secondary}
              //color={"lightgreen"}
              justify="flex-start"
              align="center"
            >
              <Text
                variant="dm_sans_semiBold_32"
                style={{
                  color: theme.colors.ui.tertiary,
                }}
              >
                $19.22
              </Text>
            </Container>
            <Container
              width="50%"
              height="60%"
              // color={"blue"}
              direction="row"
            >
              <Container
                width="100%"
                height="100%"
                // color={"red"}
                direction="row"
                justify="space-evenly"
                color={theme.colors.ui.secondary}
              >
                <Action_Container
                  width="20%"
                  height="40%"
                  color={theme.colors.ui.secondary}
                  border_radius="15px"
                  border_width="2px"
                  border_color={theme.colors.ui.white}
                >
                  <Text
                    variant="dm_sans_bold_14"
                    style={{
                      color: theme.colors.ui.tertiary,
                    }}
                  >
                    -
                  </Text>
                </Action_Container>
                <Text
                  variant="dm_sans_bold_16"
                  style={{
                    color: theme.colors.ui.tertiary,
                  }}
                >
                  1
                </Text>
                <Action_Container
                  width="20%"
                  height="40%"
                  color={theme.colors.ui.secondary}
                  border_radius="15px"
                  border_width="2px"
                  border_color={theme.colors.ui.white}
                >
                  <Text
                    variant="dm_sans_bold_14"
                    style={{
                      color: theme.colors.ui.tertiary,
                    }}
                  >
                    +
                  </Text>
                </Action_Container>
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>
    </>
  );
};
