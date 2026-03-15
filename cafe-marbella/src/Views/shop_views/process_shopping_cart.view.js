import React, { useContext, useCallback } from "react";
import { FlatList } from "react-native";
import { useTheme } from "styled-components/native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Shopping_Cart_Title } from "../../components/titles/shopping_cart.title";
import { Product_Cart_Item_Tile } from "../../components/tiles/product_cart_item.tile";
import { Shopping_Cart_Sub_Total_Footer } from "../../components/footers/shopping_cart_sub_total.footer";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { CartContext } from "../../infrastructure/services/cart/cart.context";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";
import { createdAt } from "expo-updates";
export default function Process_Shopping_Cart_View() {
  const theme = useTheme();
  // *************
  const { cart, isLoading, cartTotalItems, isUpdatingQty } =
    useContext(CartContext);
  const { user_id, sub_total, total, taxes, products, quantity, cart_id } =
    cart || {};
  // const products = cart?.products ?? [];
  // const sub_total = cart?.sub_total ?? 0;

  const { setMyOrder } = useContext(OrdersContext);

  const { user } = useContext(AuthenticationContext);
  const { first_name, last_name, email, phone_number, uid, address } =
    user || {};
  // *************
  const navigation = useNavigation();

  const renderProductCartItemTile = ({ item }) => {
    const image = item?.size_variants?.[0]?.images?.[0]; // ✅ safe
    return (
      <Spacer position="bottom" size="medium">
        <Product_Cart_Item_Tile image={image} product={item} />
      </Spacer>
    );
  };

  return (
    <SafeArea background_color={theme.colors.bg.elements_bg}>
      {isLoading ? (
        <Global_activity_indicator
          caption="Wait, we are updating shopping cart..."
          caption_width="65%"
        />
      ) : (
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.screens_bg}
          // color={"green"}
          justify="flex-start"
          align="center"
        >
          <Go_Back_Header action={() => navigation.popToTop()} label="" />
          <Spacer position="top" size="small" />
          <Shopping_Cart_Title cartTotalItems={cartTotalItems} />
          <Spacer position="top" size="small" />
          <Container
            width="100%"
            height="55%"
            color={theme.colors.bg.elements_bg}
            // color={"green"}
            justify="center"
            align="center"
          >
            <Spacer position="top" size="medium" />

            <FlatList
              style={{ flex: 1 }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={products}
              renderItem={renderProductCartItemTile}
              keyExtractor={(item, id) => {
                return item.id;
              }}
              gap={"15px"}
            />
          </Container>
          <Spacer position="top" size="large" />
          <Shopping_Cart_Sub_Total_Footer sub_total={sub_total} />
          <Spacer position="top" size="medium" />
          {isUpdatingQty ? (
            <Global_activity_indicator
              caption="Updating cart..."
              caption_width="60%"
            />
          ) : (
            <Regular_CTA
              width="95%"
              height="10%"
              color={theme.colors.ui.business}
              border_radius={"40px"}
              caption="Proceed to checkout"
              caption_text_variant="dm_sans_bold_20"
              action={() => {
                const latestProducts = cart?.products ?? [];

                // ✅ Use auth context, NOT cart.user_id
                const isAuthed = !!user?.authenticated || !!user?.user_id;

                if (!isAuthed) {
                  navigation.navigate("AuthModal", {
                    screen: "Login_View",
                    params: {
                      returnTo: {
                        tab: "Shop",
                        screen: "Shop_Delivery_Type_View",
                        params: { coming_from: "Process_Shopping_Cart_View" },
                      },
                    },
                  });
                  return;
                }

                // Build the order BEFORE any navigation
                setMyOrder((prevOrder) => ({
                  ...prevOrder,
                  customer: {
                    first_name: user?.first_name ?? "",
                    last_name: user?.last_name ?? "",
                    email: user?.email ?? "",
                    phone_number: user?.phone_number ?? "",
                    customer_address: user?.address ?? "",
                    uid: user?.uid ?? "",
                    customer_qr: {
                      active: true,
                      createdAt: new Date().toISOString(),
                      customer_token: user?.customer_qr.customer_token ?? "",
                    },
                  },
                  order_status: "In Progress",
                  order_products: latestProducts,
                  pricing: {
                    sub_total: cart?.sub_total ?? 0,
                    taxes: cart?.taxes ?? 0,
                    discount: 0,
                    shipping: 0,
                    total: cart?.total ?? 0,
                  },
                }));

                // ✅ Push onto THIS stack so GO_BACK works
                navigation.navigate("Shop_Delivery_Type_View", {
                  coming_from: "Process_Shopping_Cart_View",
                });
              }}
            />
          )}
        </Container>
      )}
    </SafeArea>
  );
}
