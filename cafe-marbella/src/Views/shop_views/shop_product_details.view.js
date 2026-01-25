import React, { useContext } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";

import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Product_Details_Card } from "../../components/cards/product_details_card/product_details.card";

import { CartContext } from "../../infrastructure/services/cart/cart.context";

export default function Shop_Product_Details_View({ route }) {
  const theme = useTheme();
  const navigation = useNavigation();
  const { item } = route.params;
  console.log("Product Details View - item:", JSON.stringify(item, null, 2));
  const { isLoading } = useContext(CartContext);
  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Go_Back_Header
        action={() => navigation.goBack()}
        label="Product Details"
      />
      {isLoading ? (
        <Global_activity_indicator
          caption="Wait, we are adding to shopping cart..."
          caption_width="65%"
        />
      ) : (
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          <Product_Details_Card item={item} />
        </ScrollView>
      )}
    </SafeArea>
  );
}
