import React, { useContext } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Delivery_Type_CTA } from "../../components/ctas/delivery_type.cta";

import { CartContext } from "../../infrastructure/services/cart/cart.context";

import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import DeliveryTruckIcon from "../../../assets/my_icons/deliveryTruckIcon.svg";

export default function Shop_Delivery_Type_View() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { cart } = useContext(CartContext);
  console.log("Shop_Delivery_Type_View: cart =", JSON.stringify(cart, null, 2));
  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      <Container
        width="100%"
        height="900px"
        color={theme.colors.bg.screens_bg}
        justify="flex-start"
        align="center"
      >
        <Go_Back_Header
          action={() => navigation.goBack()}
          label="Delivery type"
        />
        <Container
          width="100%"
          height="15%"
          color={theme.colors.bg.elements_bg}
        >
          <Text variant="raleway_bold_18">
            How do you wanna get your order?
          </Text>
        </Container>
        <Container
          width="100%"
          height="20%"
          color={theme.colors.bg.elements_bg}
          //   color={"lightgreen"}
          direction="row"
          justify="space-evenly"
          align="center"
        >
          <Delivery_Type_CTA
            width={"40%"}
            height={"85%"}
            caption="Pick up"
            caption_text_variant="raleway_bold_18_white"
            Icon={StoreIcon}
            type="pickup"
            border_radius="10px"
            action={() => null}
          />
          <Delivery_Type_CTA
            width={"40%"}
            height={"85%"}
            caption="Delivery"
            caption_text_variant="raleway_bold_18_white"
            Icon={DeliveryTruckIcon}
            type="delivery"
            border_radius="10px"
            delivery_fee=""
            action={() => null}
          />
        </Container>
      </Container>
    </SafeArea>
  );
}
