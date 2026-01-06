import React, { useContext } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Delivery_Type_CTA } from "../../components/ctas/delivery_type.cta";
import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import DeliveryTruckIcon from "../../../assets/my_icons/deliveryTruckIcon.svg";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { CartContext } from "../../infrastructure/services/cart/cart.context";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";

export default function Shop_Delivery_Type_View() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { cart } = useContext(CartContext);
  const { user_id, sub_total, total, taxes, products, quantity, cart_id } =
    cart;
  const { myWarehouse } = useContext(WarehouseContext);
  const { warehouse_id, warehouse_name, geo, warehouse_information } =
    myWarehouse;
  const { formatted_address } = geo || {};
  const { phone } = warehouse_information || {};
  console.log("Shop_Delivery_Type_View: cart =", JSON.stringify(cart, null, 2));

  const { user } = useContext(AuthenticationContext);
  const { first_name, last_name, email, phone_number, uid, address } =
    user || {};
  const { myOrder, setMyOrder, isLoading, setIsLoading } =
    useContext(OrdersContext);

  const settingMyOrderDeliveryType = (delivery_type) => {
    setIsLoading(true);
    setTimeout(() => {
      setMyOrder((prevOrder) => ({
        ...prevOrder,
        delivery_type: delivery_type,
        user_id: user_id,
        cart_id: cart_id,
        order_products: products,
        pricing: {
          sub_total: sub_total,
          taxes: Math.round(0.08 * sub_total),
          total:
            sub_total +
            Math.round(0.08 * sub_total) +
            (delivery_type === "delivery" ? 500 : 0),
          shipping: delivery_type === "delivery" ? 500 : 0,
          discount: 0,
        },
        quantity: quantity,
        warehouse_to_pickup: {
          warehouse_id: warehouse_id,
          name: warehouse_name,
          address: formatted_address,
          geo: geo,
          phone_number: phone,
        },
        customer: {
          first_name: first_name,
          last_name: last_name,
          email: email,
          phone_number: phone_number,
          address: address,
          uid: uid,
        },
      }));
      setIsLoading(false);
      navigation.navigate("Shop_Order_Review_View");
    }, 500); // Simulate a brief loading period
  };

  console.log(
    "My Order in Delivery Type View:",
    JSON.stringify(myOrder, null, 2)
  );
  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      {isLoading ? (
        <Global_activity_indicator
          caption="Wait, we are processing the order..."
          caption_width="65%"
        />
      ) : (
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
              action={() => settingMyOrderDeliveryType("pickup")}
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
      )}
    </SafeArea>
  );
}
