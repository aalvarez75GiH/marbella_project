import React, { useContext } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

import {
  Container,
  Action_Container,
} from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Delivery_Type_CTA } from "../../components/ctas/delivery_type.cta";
import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import DeliveryTruckIcon from "../../../assets/my_icons/deliveryTruckIcon.svg";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import LocationIcon from "../../../assets/my_icons/distance_icon.svg";
import { Delivery_Address_Option_Tile } from "../../components/tiles/delivery_address_option.tile";

import { CartContext } from "../../infrastructure/services/cart/cart.context";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context";

import AddIcon from "../../../assets/my_icons/addIcon.svg";
export default function Shop_Delivery_Type_View() {
  const [deliveryOption, setDeliveryOption] = React.useState(null);
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

  const { myOrder, setMyOrder, isLoading, setIsLoading } =
    useContext(OrdersContext);

  const { customer } = myOrder || {};
  const { address } = customer || {};
  console.log("DELIVERY TYPE OPTION:", deliveryOption);

  const settingMyOrderDeliveryType = (delivery_type) => {
    if (delivery_type === "delivery") {
      setDeliveryOption("delivery");
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
            warehouse_id: "",
            name: "",
            address: "",
            geo: {},
            phone_number: "",
            closing_time: "",
            opening_time: "",
          },
        }));
        setIsLoading(false);
        // navigation.navigate("Shop_Order_Review_View");
      }, 500); // Simulate a brief loading period
    }

    if (delivery_type === "pickup") {
      setDeliveryOption("pickup");
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
            closing_time: warehouse_information?.closing_time,
            opening_time: warehouse_information?.opening_time,
          },
        }));
        setIsLoading(false);
        navigation.navigate("Shop_Order_Review_View");
      }, 500); // Simulate a brief loading period
    }
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
              action={() => settingMyOrderDeliveryType("delivery")}
            />
          </Container>
          {deliveryOption === "delivery" && (
            <>
              <Container
                width="100%"
                height="10%"
                color={theme.colors.bg.elements_bg}
              >
                <Text variant="raleway_bold_18">
                  Select your delivery address
                </Text>
              </Container>
              {/* ********* Delivery address options components ******** */}
              <Delivery_Address_Option_Tile
                address={address}
                address_option={"current_address"}
                action={() => {
                  setMyOrder((prevOrder) => ({
                    ...prevOrder,
                    order_delivery_address: address,
                  }));
                  navigation.navigate("Shop_Order_Review_View");
                }}
              />
              <Delivery_Address_Option_Tile
                address={address}
                address_option={"new_address"}
              />
            </>
          )}
        </Container>
      )}
    </SafeArea>
  );
}
