import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../../infrastructure/typography/text.component"; // or RN Text
import BuggyIcon from "../../../assets/my_icons/buggy.svg";
import { Container } from "../containers/general.containers";
import { Spacer } from "../spacers and globals/optimized.spacer.component";

export const Cart_Active_With_Items_CTA = ({
  color,
  size = 25,
  quantity,
  type,
}) => {
  return type === 1 ? (
    <>
      <Container
        width={"100%"}
        height={"100%"}
        justify="center"
        align="center"
        direction="row"
        color={color}
      >
        <BuggyIcon width={size} height={size} fill={"#FFFFFF"} />
        <Spacer position="left" size="medium" />
        {quantity > 0 && (
          <Container width={size} height={size} color={"#FFFFFF"}>
            <Container
              width={"24px"}
              height={"24px"}
              border_radius={"12px"}
              paddingHorizontal={0}
              align="center"
              justify="center"
              color={"#E53935"}
              styles={{
                position: "absolute",
                top: 0,
                right: 0,
              }}
            >
              <Text variant="dm_sans_bold_12_white">
                {quantity > 9 ? "9+" : quantity}
              </Text>
            </Container>
          </Container>
        )}
      </Container>
    </>
  ) : (
    <Container
      width={25}
      height={25}
      justify="center"
      align="center"
      direction="column"
      color="transparent"
    >
      <BuggyIcon width={size} height={size} fill={"#FFFFFF"} />
      {quantity > 0 && (
        <Container
          width="25px"
          height="25px"
          border_radius={"15px"}
          justify="center"
          align="center"
          direction="column"
          color={"#E53935"}
          padding_horizontal={0}
          style={{
            position: "absolute",
            top: -13,
            right: -20,
          }}
        >
          <Text variant="dm_sans_bold_12_white">
            {quantity > 9 ? "9+" : quantity}
          </Text>
        </Container>
      )}
    </Container>
  );
};
