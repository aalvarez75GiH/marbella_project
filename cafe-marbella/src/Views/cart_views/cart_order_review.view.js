import React, { useContext, useCallback } from "react";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";
import {
  useNavigation,
  useRoute,
  StackActions,
} from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Product_Cart_Item_For_Review_Tile } from "../../components/tiles/product_cart_item_for_review.tile";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Order_Info_Tile } from "../../components/tiles/order_info.tile";
import { Delivery_type_Badge } from "../../components/others/delivery_type.badge";
import { Delivery_Information_Order_Tile } from "../../components/tiles/delivery_information_order.tile";
import { Splitter_Component } from "../../components/others/grey_splitter.component";
import { Go_Back_Header_With_Label_And_Menu } from "../../components/headers/goBack_with_label_and_menu.header";

import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";
import { GlobalContext } from "../../infrastructure/services/global/global.context";

export default function Cart_Order_Review_View() {
  const theme = useTheme();
  const { t } = useTranslation();
  const route = useRoute();
  const tabBarHeight = useBottomTabBarHeight();
  const { order } = route.params;
  const { isLoading, setDeliveryOption, setDifferentAddress } =
    useContext(OrdersContext);
  const { formatCentsToUSD } = useContext(GlobalContext);
  // console.log("MY ORDER AT REVIEW VIEW:", JSON.stringify(order, null, 2));
  const { myWarehouse } = useContext(WarehouseContext);
  const { distance_in_miles } = myWarehouse || {};
  const {
    pricing,
    warehouse_to_pickup,
    order_products,
    delivery_type,
    quantity,
    order_delivery_address,
    shipping_rate,
  } = order || {};
  const { carrier_name, delivery_days, carrier_delivery_days } =
    shipping_rate || {};
  const { sub_total, shipping, taxes, discount, total } = pricing || {};
  const shippingAmountInCents = formatCentsToUSD(shipping) || 0;

  const {
    name: warehouse_name,
    warehouse_address,
    closing_time,
    opening_time,
    geo,
  } = warehouse_to_pickup || {};
  const { lat, lng } = geo || {};

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
  //   let delivery_type = "pickup";

  const renderingOrderProducts = () => {
    return order_products.map((item) => {
      return (
        <Spacer position="bottom" size="medium" key={item.id}>
          <Product_Cart_Item_For_Review_Tile
            image={item?.size_variants?.[0]?.images?.[0]}
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
            action={() => {
              setDeliveryOption(null);
              setDifferentAddress("");

              const state = navigation.getState();

              const deliveryTypeIndex = state.routes.findIndex(
                (r) => r.name === "Cart_Delivery_Type_View"
              );

              if (deliveryTypeIndex !== -1) {
                navigation.dispatch(
                  StackActions.pop(state.index - deliveryTypeIndex)
                );
              } else {
                navigation.replace("Cart_Delivery_Type_View");
              }
            }}
            caption={t("order_review_view.header")}
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
              {/* <Spacer position="top" size="small" /> */}
              <>
                {delivery_type === "pickup" ? (
                  <Delivery_type_Badge
                    caption_text_variant="dm_sans_bold_14"
                    caption={t(
                      "order_review_view.delivery_badge.pickup.caption"
                    )}
                    type="pickup"
                  />
                ) : (
                  <Delivery_type_Badge
                    caption_text_1_variant="dm_sans_bold_16"
                    caption_text_2_variant="dm_sans_bold_14"
                    caption_1={t(
                      "order_review_view.delivery_badge.delivery.caption_1"
                    )}
                    caption_2={t(
                      "order_review_view.delivery_badge.delivery.caption_2",
                      {
                        shippingAmountInCents,
                      }
                    )}
                    type="delivery"
                  />
                )}

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
              </>

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
              color={theme.colors.ui.business}
              border_radius={"40px"}
              caption={t("order_review_view.cta")}
              caption_text_variant="dm_sans_bold_20"
              action={() => navigation.navigate("Cart_Payment_View")}
            />
          </Container>
        </>
      )}
    </SafeArea>
  );
}
