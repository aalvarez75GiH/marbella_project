import React, { useContext, useEffect } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Delivery_Type_CTA } from "../../components/ctas/delivery_type.cta";
import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import DeliveryTruckIcon from "../../../assets/my_icons/deliveryTruckIcon.svg";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Delivery_Address_Option_Tile } from "../../components/tiles/delivery_address_option.tile";

import { CartContext } from "../../infrastructure/services/cart/cart.context";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";

export default function Shop_Delivery_Type_View() {
  const route = useRoute();
  const { coming_from } = route.params || {};
  const theme = useTheme();
  const navigation = useNavigation();
  const { cart } = useContext(CartContext);
  const { user_id, sub_total, total, taxes, products, quantity, cart_id } =
    cart;
  const { myWarehouse } = useContext(WarehouseContext);
  const {
    warehouse_id,
    warehouse_name,
    geo,
    warehouse_information,
    distance_in_miles,
    distance_time,
    max_limit_pickup_ratio,
  } = myWarehouse;
  // console.log("DISTANCE IN MILES:", distance_in_miles);
  const { formatted_address } = geo || {};
  const { phone } = warehouse_information || {};
  const distanceMilesNumber = parseFloat(distance_in_miles);
  const warehouse_distance_range_positive =
    distanceMilesNumber < max_limit_pickup_ratio;

  const {
    myOrder,
    setMyOrder,
    isLoading,
    differentAddress,
    handlingDeliveryOption,
    setDeliveryOption,
    deliveryOption,
    handlingPickupOption,
  } = useContext(OrdersContext);

  const { customer } = myOrder || {};
  const { customer_address } = customer || {};
  // console.log("DELIVERY TYPE OPTION:", deliveryOption);

  console.log(
    "MY ORDER AT DELIVERY TYPE VIEW:",
    JSON.stringify(myOrder, null, 2)
  );

  const { onTaxes } = useContext(PaymentsContext);

  useEffect(() => {
    setMyOrder((prevOrder) => ({
      ...prevOrder,
      order_delivery_address:
        differentAddress !== "" ? differentAddress : customer_address,
    }));
  }, [differentAddress]);

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
              action={() => {
                const nextOrder = {
                  ...myOrder,
                  delivery_type: "pickup",
                };

                setMyOrder(nextOrder);

                handlingPickupOption({
                  navigation,
                  onTaxes,
                  user_id,
                  cart_id,
                  products,
                  sub_total,
                  quantity,
                  warehouse_id,
                  warehouse_name,
                  formatted_address,
                  geo,
                  phone,
                  warehouse_information,
                  distance_in_miles,
                  distance_time,
                  coming_from,
                  warehouse_distance_range_positive,
                  nextOrder, // ✅ pass it
                });
              }}
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
              // action={() => settingMyOrderDeliveryType("delivery")}
              action={() => {
                setDeliveryOption("delivery");
                setTimeout(() => {
                  setMyOrder((prevOrder) => ({
                    ...prevOrder,
                    delivery_type: "delivery",
                    user_id: user_id,
                    cart_id: cart_id,
                    pricing: {
                      sub_total: sub_total,
                      taxes: 0,
                      total: 0,
                      shipping: 500,
                      discount: 0,
                    },
                    quantity: quantity,
                    warehouse_to_pickup: {
                      warehouse_id: warehouse_id,
                      name: warehouse_name,
                      warehouse_address: formatted_address,
                      geo: geo,
                      phone_number: phone,
                      closing_time: warehouse_information?.closing_time,
                      opening_time: warehouse_information?.opening_time,
                      distance_in_miles: distance_in_miles,
                    },
                    order_delivery_address: customer_address,
                  }));
                }, 500); // Simulate a brief loading period
              }}
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
                customer_address={customer_address}
                address_option={"current_address"}
                action={async () => {
                  await handlingDeliveryOption({
                    navigation,
                    onTaxes,
                    differentAddress,
                    customer_address,
                  });
                }}
              />
              <Delivery_Address_Option_Tile
                address={customer_address}
                address_option={"new_address"}
                action={async () => {
                  navigation.navigate("Different_Delivery_Address_View");
                }}
              />
            </>
          )}
        </Container>
      )}
    </SafeArea>
  );
}
