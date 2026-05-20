import React, { useContext, useState } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Platform, KeyboardAvoidingView, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Text } from "../../infrastructure/typography/text.component";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";
import { GeolocationContext } from "../../infrastructure/services/geolocation/geolocation.context";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";
import { CartContext } from "../../infrastructure/services/cart/cart.context";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";

export default function Different_Delivery_Address_View() {
  const theme = useTheme();
  const { t } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();

  const [selectedAddress, setSelectedAddress] = useState(null);

  const CTA_HEIGHT = 65;

  const { deviceLat, deviceLng } = useContext(GeolocationContext);
  const { onTaxes } = useContext(PaymentsContext);

  const {
    setDifferentAddress,
    handlingDeliveryOption,
    myOrder,
    setIsCheckoutLoading,
    isCheckoutLoading,
    buildDeliveryOrder,
  } = useContext(OrdersContext);

  const { buildShipToFromGooglePlace, user } = useContext(
    AuthenticationContext
  );

  const { customer_address } = myOrder || {};

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

  const { ship_from } = myWarehouse || {};

  const handleAddressPress = (data, details = null) => {
    const formatted = details?.formatted_address ?? data.description;

    const shipToDA = buildShipToFromGooglePlace({
      details,
      user: {
        name: `${user.first_name} ${user.last_name}`,
        phone: user.phone_number,
      },
    });

    const lat = details?.geometry?.location?.lat;
    const lng = details?.geometry?.location?.lng;

    if (formatted && typeof lat === "number" && typeof lng === "number") {
      setDifferentAddress(formatted);
      // setShip_to_different_address(shipToDA);

      setSelectedAddress({
        formatted_address: formatted,
        lat,
        lng,
        place_id: details?.place_id ?? data?.place_id,
        ship_to: shipToDA, // ✅ important
      });
    } else {
      setSelectedAddress(null);
    }
  };

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      {isCheckoutLoading ? (
        <Global_activity_indicator
          caption={t(
            "delivery_type_view.different_delivery_view.activity_indicator"
          )}
          caption_width="65%"
        />
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <Container
            width="100%"
            height="100%"
            color={theme.colors.bg.elements_bg}
            justify="flex-start"
            align="center"
            style={{ position: "relative" }}
          >
            <Exit_Header_With_Label
              label="Delivery Address"
              action={() => navigation.goBack()}
            />

            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />

            <Container
              width="100%"
              color={theme.colors.bg.elements_bg}
              justify="flex-start"
              align="flex-start"
              style={{ paddingVertical: 12 }}
            >
              <Spacer position="left" size="large">
                <Text variant="raleway_bold_20">
                  {t("delivery_type_view.different_delivery_view.caption_1")}
                </Text>

                <Spacer position="top" size="medium" />

                <Text variant="raleway_medium_18">
                  {" "}
                  {t("delivery_type_view.different_delivery_view.caption_2")}
                </Text>
              </Spacer>
            </Container>

            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />

            <Container
              width="100%"
              color={theme.colors.bg.elements_bg}
              justify="flex-start"
              align="center"
              style={{
                paddingVertical: 10,
                zIndex: 9999,
                elevation: 9999,
              }}
            >
              <View
                style={{
                  width: "93%",
                  alignSelf: "center",
                  overflow: "visible",
                  zIndex: 9999,
                  elevation: 9999,
                }}
                pointerEvents="box-none"
              >
                <GooglePlacesAutocomplete
                  placeholder={t(
                    "delivery_type_view.different_delivery_view.input_placeholder"
                  )}
                  fetchDetails
                  listViewDisplayed="auto"
                  keyboardShouldPersistTaps="handled"
                  enablePoweredByContainer={false}
                  minLength={Platform.OS === "ios" ? 1 : 2}
                  debounce={250}
                  query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY,
                    language: "en",
                    components: "country:us",
                    location: `${deviceLat},${deviceLng}`,
                    radius: 50000,
                    types: "geocode",
                  }}
                  textInputProps={{
                    multiline: false,
                    numberOfLines: 1,
                    scrollEnabled: true,
                    clearButtonMode: "while-editing",
                    returnKeyType: "done",
                    onChangeText: () => setSelectedAddress(null),
                  }}
                  onPress={handleAddressPress}
                  styles={{
                    container: {
                      flex: 0,
                      width: "100%",
                      zIndex: 9999,
                      elevation: 9999,
                    },
                    textInputContainer: {
                      width: "100%",
                      height: 58,
                      paddingHorizontal: 0,
                    },
                    textInput: {
                      width: "100%",
                      height: 58,
                      fontSize: 18,
                      lineHeight: 22,
                      color: theme.colors.text.primary,
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.inputs.bottom_lines,
                      paddingLeft: 5,
                      paddingRight: 35,
                      paddingTop: 0,
                      paddingBottom: 0,
                      marginLeft: 0,
                      textAlign: "left",
                    },
                    listView: {
                      marginTop: 8,
                      maxHeight: 240,
                      backgroundColor: theme.colors.bg.elements_bg,
                      zIndex: 999999,
                      elevation: 999999,
                    },
                    row: {
                      minHeight: 62,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      backgroundColor: theme.colors.bg.elements_bg,
                    },
                    description: {
                      fontSize: 16,
                      color: theme.colors.text.primary,
                    },
                    separator: {
                      height: 1,
                      backgroundColor: "#D0D0D0",
                    },
                  }}
                />
              </View>
            </Container>

            <Container
              width="100%"
              color={theme.colors.bg.elements_bg}
              justify="center"
              align="center"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: tabBarHeight + 8,
                paddingTop: 8,
                paddingBottom: 5,
                zIndex: 100,
                elevation: 100,
              }}
            >
              {selectedAddress ? (
                <Regular_CTA
                  width="95%"
                  height={CTA_HEIGHT}
                  color={theme.colors.brand.primary}
                  border_radius="40px"
                  caption={t(
                    "delivery_type_view.different_delivery_view.cta_caption"
                  )}
                  caption_text_variant="dm_sans_bold_20_white"
                  action={async () => {
                    setIsCheckoutLoading(true);
                    console.log(
                      "SELECTED ADDRESS:",
                      JSON.stringify(selectedAddress, null, 2)
                    );
                    console.log(
                      "SHIP TO FROM SELECTED:",
                      JSON.stringify(selectedAddress?.ship_to, null, 2)
                    );
                    console.log(
                      "SHIP FROM:",
                      JSON.stringify(ship_from, null, 2)
                    );
                    try {
                      const nextOrder = await buildDeliveryOrder({
                        myOrder,
                        user_id,
                        cart_id,
                        sub_total,
                        quantity,
                        warehouse: myWarehouse,
                        customer_address,
                        ship_to: selectedAddress.ship_to, // ✅ use selected address directly
                        ship_from,
                        gettingRateForDelivery,
                      });

                      const finalNextOrder = {
                        ...nextOrder,
                        order_delivery_address:
                          selectedAddress.formatted_address, // ✅ different address
                        customer_address, // original user address stays available
                        ship_to: selectedAddress.ship_to,
                      };

                      await handlingDeliveryOption({
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
              ) : (
                <View style={{ height: CTA_HEIGHT }} />
              )}
            </Container>
          </Container>
        </KeyboardAvoidingView>
      )}
    </SafeArea>
  );
}
