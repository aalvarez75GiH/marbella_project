import React, { useContext } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { rootNavigate } from "../../infrastructure/navigation/navigation_ref";
import { ScrollView } from "react-native-gesture-handler";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Product_Cart_Item_For_Review_Tile } from "../../components/tiles/product_cart_item_for_review.tile";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Order_Info_Tile } from "../../components/tiles/order_info.tile";
import { Delivery_Information_Order_Tile } from "../../components/tiles/delivery_information_order.tile";
import { Splitter_Component } from "../../components/others/grey_splitter.component";
import { Payment_method_Info_Tile } from "../../components/tiles/payment_method_used_info.tile";
import { myOrder_schema } from "../../infrastructure/services/orders/orders.local_data";
import { Go_Back_Header_With_Label_And_Menu } from "../../components/headers/goBack_with_label_and_menu.header";

import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";
import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";

export default function Shop_Order_Receipt_View() {
  const theme = useTheme();
  const { t } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();
  const iOs = Platform.OS === "ios";
  const { myOrder, setMyOrder } = useContext(OrdersContext);
  console.log(
    "myOrder in Shop_Order_Receipt_View:",
    JSON.stringify(myOrder, null, 2)
  );
  const { myWarehouse, gettingWarehouseByID, isLoading } =
    useContext(WarehouseContext);
  const { distance_in_miles, warehouse_id } = myWarehouse || {};
  const {
    pricing,
    warehouse_to_pickup,
    order_products,
    delivery_type,
    payment_information,
    quantity,
    order_delivery_address,
    shipping_rate,
  } = myOrder || {};
  const { carrier_name, delivery_days, carrier_delivery_days } =
    shipping_rate || {};
  const { sub_total, shipping, taxes, discount, total } = pricing || {};
  const { last_four } = payment_information || {};
  const {
    name: warehouse_name,
    warehouse_address,
    closing_time,
    opening_time,
    geo,
  } = warehouse_to_pickup || {};
  const { lat, lng } = geo || {};

  const { setCardVerified } = useContext(PaymentsContext);

  const { comingFrom } = useContext(AuthenticationContext);

  const navigation = useNavigation();

  const renderingOrderProducts = () => {
    return order_products.map((item) => {
      return (
        <Spacer position="bottom" size="medium" key={item.id}>
          <Product_Cart_Item_For_Review_Tile
            image={item.size_variants[0].images[0]}
            product={item}
          />
        </Spacer>
      );
    });
  };

  console.log(
    "Parent route names:",
    navigation.getParent()?.getState()?.routeNames
  );

  const goAfterReceipt = () => {
    const targetTab = comingFrom === "Shopping_Cart_View" ? "Cart" : "Shop";

    const targetScreen =
      comingFrom === "Shopping_Cart_View"
        ? "Shopping_Cart_View"
        : "Shop_Products_View";

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "App",
            state: {
              routes: [
                {
                  name: targetTab,
                  state: {
                    routes: [{ name: targetScreen }],
                  },
                },
              ],
            },
          },
        ],
      })
    );
  };

  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      {isLoading ? (
        <Global_activity_indicator
          caption="Wait, we are coming back to Shop..."
          caption_width="65%"
        />
      ) : (
        <>
          <Go_Back_Header
            action={() => navigation.goBack()}
            label="Order receipt"
          />
          {/* <Go_Back_Header_With_Label_And_Menu
            action_1={() => navigation.goBack()}
            action_2={() => navigation.navigate("Menu_View")}
          /> */}
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: theme.colors.bg.elements_bg,
              paddingBottom: 16,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Container
              width="100%"
              align="center"
              justify="flex-start"
              style={{ flex: 1 }} // Ensures dynamic height adjustment
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
                    {t("order_receipt_view.shipment_details")}
                  </Text>
                </Spacer>
              </Container>

              <Delivery_Information_Order_Tile
                warehouse_name={warehouse_name}
                warehouse_address={warehouse_address}
                warehouse_lat={lat}
                warehouse_lng={lng}
                opening_time={opening_time}
                closing_time={closing_time}
                distance_to_warehouse_mi={distance_in_miles}
                delivery_type={delivery_type}
                order_delivery_address={order_delivery_address}
                delivery_days={
                  delivery_type === "delivery" ? delivery_days : null
                }
                carrier_delivery_days={
                  delivery_type === "delivery" ? carrier_delivery_days : null
                }
                carrier_name={
                  delivery_type === "delivery" ? carrier_name : null
                }
              />
              <Spacer position="top" size="large" />
              <Payment_method_Info_Tile last_four={last_four} />

              <Spacer position="top" size="large" />
              <Container
                width="100%"
                align="flex-start"
                color={theme.colors.bg.elements_bg}
              >
                <Spacer position="top" size="large" />
                <Spacer position="left" size="extraLarge">
                  <Text variant="dm_sans_bold_20">
                    {t("order_receipt_view.products_in_the_order")}
                  </Text>
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
            </Container>
          </ScrollView>
          <Container
            width="100%"
            padding_vertical="10px"
            color="transparent"
            // color="red"
            style={{
              paddingTop: 10,
              paddingBottom: 60,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Regular_CTA
              width="95%"
              height="70px"
              color={theme.colors.brand.primary}
              border_radius={"40px"}
              caption={t("order_receipt_view.cta")}
              caption_text_variant="dm_sans_bold_20_white"
              action={() => {
                goAfterReceipt();

                setTimeout(() => {
                  setMyOrder(myOrder_schema);
                  setCardVerified(false);
                }, 100);
              }}
            />
          </Container>
        </>
      )}
    </SafeArea>
  );
}
