import React, { useContext, useEffect } from "react";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
import { Delivery_Address_Option_Tile } from "../../components/tiles/delivery_address_option.tile";
import { safeGoBack } from "../../infrastructure/navigation/navigation.helpers";

import { CartContext } from "../../infrastructure/services/cart/cart.context";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";

export default function Cart_Delivery_Type_View() {
  const theme = useTheme();
  const navigation = useNavigation();

  const { cart: cartRaw, isLoading } = useContext(CartContext);

  const cart = cartRaw ?? {
    user_id: "",
    sub_total: 0,
    quantity: 0,
    cart_id: "",
    products: [],
  };

  const { user_id, sub_total, quantity, cart_id } = cart;

  const { myWarehouse, gettingRateForDelivery } = useContext(WarehouseContext);
  const {
    warehouse_id,
    warehouse_name,
    geo,
    warehouse_information,
    distance_in_miles,
    distance_time,
    max_limit_pickup_ratio,
    ship_from,
  } = myWarehouse;
  console.log("DISTANCE IN MILES:", distance_in_miles);
  const { formatted_address } = geo || {};
  const { phone } = warehouse_information || {};
  const distanceMilesNumber = parseFloat(distance_in_miles);

  const warehouse_distance_range_positive =
    distanceMilesNumber < max_limit_pickup_ratio;

  const {
    myOrder,
    setMyOrder,
    isCheckoutLoading,
    setIsCheckoutLoading,
    differentAddress,
    setDeliveryOption,
    deliveryOption,
    handlingDeliveryOption_Cart,
    handlingDeliveryOption,
    handlingPickupOption_Cart,
    buildDeliveryOrder,
  } = useContext(OrdersContext);

  const { customer } = myOrder || {};
  const { customer_address, ship_to } = customer || {};
  // console.log("DELIVERY TYPE OPTION:", deliveryOption);

  // console.log(
  //   "MY ORDER AT DELIVERY TYPE VIEW:",
  //   JSON.stringify(myOrder, null, 2)
  // );
  // console.log(
  //   "CART RAW AT DELIVERY TYPE VIEW:",
  //   JSON.stringify(cartRaw, null, 2)
  // );

  const { onTaxes } = useContext(PaymentsContext);

  useEffect(() => {
    setMyOrder((prevOrder) => ({
      ...prevOrder,
      order_delivery_address:
        differentAddress !== "" ? differentAddress : customer_address,
    }));
  }, [differentAddress]);

  const hasValidCart =
    typeof user_id === "string" &&
    user_id.trim().length > 0 &&
    typeof cart_id === "string" &&
    cart_id.trim().length > 0;

  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      {isCheckoutLoading ? (
        <Global_activity_indicator
          caption="Wait, we are calculating delivery fees..."
          caption_width="65%"
        />
      ) : (
        <Container
          width="100%"
          height="900px"
          //color={theme.colors.bg.screens_bg}
          color={theme.colors.bg.elements_bg}
          justify="flex-start"
          align="center"
        >
          <Go_Back_Header
            // action={() => navigation.goBack()}
            action={() =>
              safeGoBack(navigation, "Cart_Order_Review_View", {
                order: myOrder,
              })
            }
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
                if (!hasValidCart) {
                  console.log(
                    "DeliveryType: blocked pickup, missing cart/user",
                    {
                      user_id,
                      cart_id,
                    }
                  );
                  return;
                }
                const nextOrder = {
                  ...myOrder,
                  delivery_type: "pickup",
                };

                handlingPickupOption_Cart({
                  navigation,
                  onTaxes,
                  user_id,
                  cart_id,
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
                  warehouse_distance_range_positive,
                  nextOrder,
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
                if (!hasValidCart) return;
                setDeliveryOption("delivery");
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
                  setIsCheckoutLoading(true);
                  try {
                    // const nextOrder = await buildDeliveryOrder();
                    const nextOrder = await buildDeliveryOrder({
                      myOrder,
                      user_id,
                      cart_id,
                      sub_total,
                      quantity,
                      warehouse: myWarehouse,
                      customer_address,
                      ship_to,
                      ship_from,
                      gettingRateForDelivery,
                    });
                    const finalNextOrder = {
                      ...nextOrder,
                      order_delivery_address:
                        differentAddress || customer_address,
                    };

                    await handlingDeliveryOption_Cart({
                      navigation,
                      onTaxes,
                      nextOrder: finalNextOrder,
                    });
                  } catch (error) {
                    console.log(
                      "Delivery option error:",
                      error?.message || error
                    );
                  } finally {
                    setIsCheckoutLoading(false);
                  }
                }}
              />
              <Delivery_Address_Option_Tile
                address={customer_address}
                address_option={"new_address"}
                action={async () => {
                  navigation.navigate("Cart_Different_Delivery_Address_View");
                }}
              />
            </>
          )}
        </Container>
      )}
    </SafeArea>
  );
}
