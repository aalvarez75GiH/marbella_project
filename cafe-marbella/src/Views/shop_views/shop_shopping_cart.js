import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "styled-components/native";

import { Container } from "../../components/containers/general.containers";
// import BuggyIcon from "../../../assets/my_icons/buggy_icon.svg";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";

import { CartContext } from "../../infrastructure/services/cart/cart.context";
export default function Shop_Shopping_Cart_View() {
  const theme = useTheme();
  const { cart } = useContext(CartContext);
  console.log("CART IN SHOPPING CART VIEW:", JSON.stringify(cart, null, 2));
  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.screens_bg}
        // color={"green"}
        justify="flex-start"
        align="center"
      >
        <Go_Back_Header action={() => null} label="Shopping cart" />
        <Spacer position="top" size="large" />
        {/* <Product_Initial_Card /> */}
      </Container>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme.colors.ui.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  test: {
    width: 300,
    height: 300,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
