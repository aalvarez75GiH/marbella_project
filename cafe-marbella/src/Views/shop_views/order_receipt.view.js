import React, { useContext, useCallback } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { rootNavigate } from "../../infrastructure/navigation/navigation_ref";
import { ScrollView } from "react-native-gesture-handler";

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

import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";
import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";

export default function Shop_Order_Receipt_View() {
  const theme = useTheme();
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
  } = myOrder || {};
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
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: "none" } });

      return () => {
        parent?.setOptions({ tabBarStyle: { display: "flex" } });
      };
    }, [navigation])
  );

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
                    Shipment details
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
            </Container>
          </ScrollView>
          <Container
            width="100%"
            height="12%"
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="center"
          >
            <Regular_CTA
              width="95%"
              height="70%"
              color={theme.colors.brand.primary}
              border_radius={"40px"}
              caption="Done"
              caption_text_variant="dm_sans_bold_20_white"
              action={async () => {
                setMyOrder(myOrder_schema);
                setCardVerified(false);
                const warehouse_by_id = await gettingWarehouseByID(
                  warehouse_id
                );
                console.log(
                  "MY WAREHOUSE BEFORE NAVIGATING BACK TO HOME: ",
                  JSON.stringify(warehouse_by_id, null, 2)
                );

                if (comingFrom === "Shopping_Cart_View") {
                  rootNavigate("App", {
                    screen: "Cart",
                    params: { screen: "Shopping_Cart_View" }, // <-- exact Cart navigator screen name
                  });
                } else {
                  rootNavigate("App", {
                    screen: "Shop",
                    params: { screen: "Home_View" },
                  });
                }
              }}
            />
          </Container>
        </>
      )}
    </SafeArea>
  );
}
