import React, { useLayoutEffect } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { Image, StyleSheet } from "react-native";

// import MartbellaLogoPNG from "../../../assets/brand_images/Marbella_logo.png";
import {
  Container,
  Action_Container,
} from "../../components/containers/general.containers";
import { Text } from "../../infrastructure/typography/text.component";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Product_Details_Card } from "../../components/cards/product_details_card/product_details.card";

import { CartContext } from "../../infrastructure/services/cart/cart.context";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";

export default function Order_Confirmation_View({ route }) {
  const theme = useTheme();
  const navigation = useNavigation();
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

  return (
    <SafeArea
      background_color={theme.colors.brand.secondary}
      style={{ flex: 1 }}
    >
      <Container
        width="100%"
        style={{ flex: 1 }}
        justify="flex-start"
        align="center"
        // color={theme.colors.brand.secondary}
        color={"red"}
      >
        <Container
          width="100%"
          height="20%"
          color={theme.colors.brand.secondary}
        >
          <Image
            source={require("../../../assets/brand_images/marbella_logo.png")}
            style={styles.image_1}
          />
        </Container>
        <Container
          width="100%"
          height="10%"
          color={theme.colors.brand.secondary}
          //   color={"lightgrey"}
        >
          <Text variant="cormorant_bold_32_italic">
            Thanks for choosing us!
          </Text>
        </Container>

        <Container
          width="100%"
          height="40%"
          color={theme.colors.brand.secondary}
        >
          <Image
            source={require("../../../assets/brand_images/meet_marbella_transparent.png")}
            style={styles.image_2}
          />
        </Container>
        <Container
          width="100%"
          height="10%"
          color={theme.colors.brand.secondary}
          //   color={"lightgrey"}
        >
          <Text
            variant="raleway_bold_20"
            style={{ color: theme.colors.brand.primary }}
          >
            Order placed successfully!!
          </Text>
          <Spacer position="top" size="small" />
          <Text
            variant="raleway_bold_14"
            style={{ color: theme.colors.brand.primary }}
          >
            We have sent your receipt by email
          </Text>
        </Container>
        <Container
          width="100%"
          height="20%"
          color={theme.colors.brand.secondary}
          //   color={"lightgrey"}
          direction="row"
          justify="space-between"
        >
          {/* <Spacer position="left" size="small" /> */}
          <Action_Container
            width="40%"
            height="25%"
            // color={theme.colors.brand.primary}
            color={"transparent"}
            margin_left="5%"
            justify="center"
            align="center"
            onPress={() => navigation.navigate("Shop_Order_Receipt_View")}
          >
            <Text
              variant="raleway_bold_16"
              style={{
                textDecorationLine: "underline",
                color: theme.colors.brand.primary,
              }}
            >
              View order receipt
            </Text>
          </Action_Container>
          <Action_Container
            width="40%"
            height="25%"
            color={"transparent"}
            margin_right="5%"
            justify="center"
            align="center"
            onPress={() => navigation.popToTop()}
          >
            <Text
              variant="raleway_bold_16"
              style={{
                textDecorationLine: "underline",
                color: theme.colors.brand.primary,
              }}
            >
              Tap top go Home
            </Text>
          </Action_Container>
          {/* <Spacer position="right" size="small" /> */}
        </Container>
      </Container>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  image_1: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  image_2: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
});
