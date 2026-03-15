import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "styled-components/native";
import { ScrollView } from "react-native-gesture-handler";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Snackbar } from "react-native-paper";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Product_Cart_Item_For_Review_Tile } from "../../components/tiles/product_cart_item_for_review.tile";
import { Order_Info_Tile } from "../../components/tiles/order_info.tile";
import { RT_Delivery_Information_Order_Tile } from "../../components/tiles/rt_delivery_information_order_tile";
import { Customer_Order_Info_Tile } from "../../components/tiles/customer_order_info.tile";
import { Splitter_Component } from "../../components/others/grey_splitter.component";
import { Payment_method_Info_Tile } from "../../components/tiles/payment_method_used_info.tile";
import { Refunded_Information_Order_Tile } from "../../components/tiles/refunded_information_order.tile";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { OrdersContext } from "../../infrastructure/services/orders/orders.context";

export default function Order_View() {
  const theme = useTheme();
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  // const { order } = route.params;
  // console.log("ORDER ITEM AT ORDER VIEW :", JSON.stringify(order, null, 2));

  const route = useRoute();
  const initialOrder = route?.params?.order ?? null;
  const [customerOrder, setCustomerOrder] = useState(initialOrder);
  const [statusSnackbarVisible, setStatusSnackbarVisible] = useState(false);
  const [statusSnackbarMessage, setStatusSnackbarMessage] = useState("");
  // const { snackbar, showSnackbar, hideSnackbar } = useContext(GlobalContext);

  //   const { myWarehouse } = useContext(WarehouseContext);
  //   const { distance_in_miles } = myWarehouse || {};

  const { updateOrderStatus, isLoading } = useContext(OrdersContext);
  const [pickupSnackbarVisible, setPickupSnackbarVisible] = useState(false);

  const {
    pricing,
    warehouse_to_pickup,
    order_products = [],
    delivery_type,
    payment_information,
    quantity,
    order_status,
    updatedAt,
    refund_details = "Refunded",
    order_number,
    order_delivery_address,
    pickup_qr,
    customer,
    order_id,
  } = customerOrder || {};

  const { sub_total, shipping, taxes, discount, total } = pricing || {};
  const { last_four } = payment_information || {};
  const { token } = pickup_qr || {};
  const {
    warehouse_name,
    warehouse_address,
    closing_time,
    opening_time,
    distance_in_miles,
    geo,
  } = warehouse_to_pickup || {};
  const { lat, lng } = geo || {};

  const { customer_address } = customer || {};

  useFocusEffect(
    React.useCallback(() => {
      const normalizedDeliveryType = String(delivery_type || "")
        .trim()
        .toLowerCase();

      const isPickup =
        normalizedDeliveryType === "pick up" ||
        normalizedDeliveryType === "pickup";

      const shouldShow = isPickup && order_status === "In Progress" && !!token;

      let timer;

      if (shouldShow) {
        timer = setTimeout(() => {
          setPickupSnackbarVisible(true);
        }, 900); // delay after screen becomes active
      }

      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [delivery_type, order_status, token])
  );

  const renderingOrderProducts = () => {
    const products = Array.isArray(order_products) ? order_products : [];

    return products.map((item) => {
      const variantId = item?.size_variants?.[0]?.id ?? "no-variant";
      const key = `${item?.id ?? "no-id"}:${variantId}`;

      return (
        <Spacer position="bottom" size="medium" key={key}>
          <Product_Cart_Item_For_Review_Tile
            image={item?.size_variants?.[0]?.images?.[0]}
            product={item}
          />
        </Spacer>
      );
    });
  };

  const showStatusSnackbar = (message) => {
    setStatusSnackbarMessage(message);
    setStatusSnackbarVisible(true);
  };

  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      {isLoading && (
        <Global_activity_indicator
          caption="Wait, we are updating the order..."
          caption_width="65%"
        />
      )}
      {!isLoading && (
        <>
          <Go_Back_Header
            action={() => navigation.goBack()}
            label="Order information"
          />

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: theme.colors.bg.elements_bg,
              paddingBottom: 20, // Prevents last items from being cut off
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Container
              width="100%"
              align="center"
              justify="flex-start"
              style={{ flex: 1, paddingBottom: tabBarHeight }} // Ensures dynamic height adjustment
              color={theme.colors.bg.elements_bg}
              //   color={theme.colors.bg.screens_bg}
            >
              <Spacer position="top" size="small" />
              <Splitter_Component
                width="100%"
                height="5px"
                color={theme.colors.bg.screens_bg}
              />
              <Order_Info_Tile
                sub_total={sub_total}
                shipping={shipping}
                taxes={taxes}
                discount={discount}
                total={total}
                quantity={quantity}
              />
              <Splitter_Component
                width="100%"
                height="5px"
                color={theme.colors.bg.screens_bg}
              />
              <Spacer position="top" size="medium" />

              <Container
                width="100%"
                color={theme.colors.bg.elements_bg}
                justify="center"
                align="flex-start"
                padding_vertical="10px"
              >
                <Spacer position="left" size="large">
                  <Text variant="dm_sans_bold_20" style={{ marginLeft: 16 }}>
                    Shipment details
                  </Text>
                </Spacer>
              </Container>
              {order_status !== "Refunded" ? (
                <RT_Delivery_Information_Order_Tile
                  warehouse_name={warehouse_name}
                  warehouse_address={warehouse_address}
                  opening_time={opening_time}
                  closing_time={closing_time}
                  distance_to_warehouse_mi={distance_in_miles}
                  delivery_type={delivery_type}
                  order_delivery_address={order_delivery_address}
                  warehouse_lat={lat}
                  warehouse_lng={lng}
                />
              ) : (
                <Refunded_Information_Order_Tile
                  warehouse_name={warehouse_name}
                  warehouse_address={warehouse_address}
                  opening_time={opening_time}
                  closing_time={closing_time}
                  distance_to_warehouse_mi={distance_in_miles}
                  delivery_type={delivery_type}
                  customer_address={customer_address}
                  warehouse_lat={lat}
                  warehouse_lng={lng}
                  order_number={order_number}
                  updatedAt={updatedAt}
                  refund_details={refund_details}
                />
              )}
              <Spacer position="top" size="large" />
              <Payment_method_Info_Tile last_four={last_four} />
              <Spacer position="top" size="large" />

              <Customer_Order_Info_Tile
                customer={customer}
                order_number={order_number}
              />

              <Container
                width="100%"
                align="flex-start"
                color={theme.colors.bg.elements_bg}
              >
                <Spacer position="top" size="large" />
                <Spacer position="left" size="large">
                  <Text variant="dm_sans_bold_20">Products in the order</Text>
                </Spacer>
              </Container>
              <Spacer position="top" size="large" />
              <Spacer position="top" size="large" />
              <Container
                width="100%"
                height="auto"
                color={theme.colors.bg.elements_bg}
                // color={"red"}
              >
                {renderingOrderProducts()}
              </Container>
              <Spacer position="top" size="large" />
              {order_status === "In Progress" && (
                <>
                  <Regular_CTA
                    width="95%"
                    height="70px"
                    color={theme.colors.ui.primary}
                    border_radius={"10px"}
                    caption="Finish order"
                    caption_text_variant="dm_sans_bold_20_white"
                    // action={() => updateOrderStatus(order_id, "Finished")}
                    action={async () => {
                      try {
                        const res = await updateOrderStatus(
                          order_id,
                          "Finished"
                        );
                        console.log(
                          "Order status updated to Finished:",
                          JSON.stringify(res, null, 2)
                        );

                        const updatedOrder =
                          res?.order || res?.data?.order || res;

                        if (updatedOrder) {
                          setCustomerOrder(updatedOrder);
                          showStatusSnackbar("Order marked as Finished");
                        }
                      } catch (error) {
                        console.log("Error updating order status:", error);
                      }
                    }}
                  />
                  <Regular_CTA
                    width="95%"
                    height="70px"
                    color={theme.colors.ui.error}
                    border_radius={"10px"}
                    caption="Refund order"
                    caption_text_variant="dm_sans_bold_20_white"
                    action={() => null}
                  />
                </>
              )}
              {order_status === "Finished" && (
                <Regular_CTA
                  width="95%"
                  height="70px"
                  color={theme.colors.ui.primary}
                  border_radius={"10px"}
                  caption="Reactivate order"
                  caption_text_variant="dm_sans_bold_20_white"
                  // action={() => updateOrderStatus(order_id, "Finished")}
                  action={async () => {
                    try {
                      const res = await updateOrderStatus(
                        order_id,
                        "In Progress"
                      );
                      console.log(
                        "Order status updated to Finished:",
                        JSON.stringify(res, null, 2)
                      );

                      const updatedOrder =
                        res?.order || res?.data?.order || res;

                      if (updatedOrder) {
                        setCustomerOrder(updatedOrder);
                        showStatusSnackbar("Order reactivated successfully.");
                      }
                    } catch (error) {
                      console.log("Error updating order status:", error);
                    }
                  }}
                />
              )}
            </Container>
          </ScrollView>
          <>
            <Snackbar
              visible={statusSnackbarVisible}
              onDismiss={() => setStatusSnackbarVisible(false)}
              duration={Number.POSITIVE_INFINITY}
              action={{
                label: "Close",
                onPress: () => {
                  setStatusSnackbarVisible(false);
                },
              }}
              style={{
                minHeight: 80,
                marginHorizontal: 10,
                marginBottom: tabBarHeight,
                backgroundColor: theme.colors.ui.primary,
              }}
            >
              {statusSnackbarMessage}
            </Snackbar>
          </>
        </>
      )}
    </SafeArea>
  );
}
