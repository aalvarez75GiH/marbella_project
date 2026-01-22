import React, { useContext, useLayoutEffect, useEffect } from "react";
import { FlatList } from "react-native";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

import {
  Action_Container,
  Container,
} from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Shopping_Cart_Title } from "../../components/titles/shopping_cart.title";
import { Text } from "../../infrastructure/typography/text.component";
import { Product_Cart_Item_Tile } from "../../components/tiles/product_cart_item.tile";
import { Shopping_Cart_Sub_Total_Footer } from "../../components/footers/shopping_cart_sub_total.footer";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Order_Info_Tile } from "../../components/tiles/order_info.tile";
import { Delivery_type_Badge } from "../../components/others/delivery_type.badge";
import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import { Delivery_Information_Order_Tile } from "../../components/tiles/delivery_information_order.tile";
import { Splitter_Component } from "../../components/others/grey_splitter.component";
import { Payment_method_Info_Tile } from "../../components/tiles/payment_method_used_info.tile";
import { myOrder_schema } from "../../infrastructure/services/orders/orders.local_data";

import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";
import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";

export default function Shop_Order_Receipt_View() {
  const theme = useTheme();
  const { myOrder, isLoading, setMyOrder } = useContext(OrdersContext);
  console.log(
    "myOrder in Shop_Order_Review_View:",
    JSON.stringify(myOrder, null, 2)
  );
  const { myWarehouse } = useContext(WarehouseContext);
  const { distance_in_miles } = myWarehouse || {};
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

  // Hiding tab bar for this screen
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
  }, [navigation]);

  const navigation = useNavigation();
  //   let delivery_type = "pickup";

  const renderingOrderProducts = () => {
    return order_products.map((item) => {
      return (
        <Spacer position="bottom" size="medium" key={item.id}>
          <Product_Cart_Item_Tile
            image={item.size_variants[0].images[0]}
            product={item}
          />
        </Spacer>
      );
    });
  };
  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      {isLoading ? (
        <Global_activity_indicator
          caption="Wait, we are updating shopping cart..."
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
                await setMyOrder(myOrder_schema);
                await setCardVerified(false);
                navigation.popToTop();
              }}
            />
          </Container>
        </>
      )}
    </SafeArea>
  );
}
