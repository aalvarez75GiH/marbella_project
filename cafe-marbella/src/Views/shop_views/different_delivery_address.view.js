import React, { useContext, useState } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Platform, KeyboardAvoidingView, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

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
          caption="Wait, we are working with your new delivery address..."
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
                  Do you want to enter a different delivery address?
                </Text>

                <Spacer position="top" size="medium" />

                <Text variant="raleway_medium_18">Go ahead!</Text>
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
                  placeholder="New delivery address"
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
                  caption="Continue"
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

// import React, { useContext, useState } from "react";
// import { useTheme } from "styled-components/native";
// import { useNavigation } from "@react-navigation/native";
// import { Platform, KeyboardAvoidingView, ScrollView, View } from "react-native";
// // import { GooglePlacesAutocomplete } from "expo-google-places-autocomplete";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

// import { Container } from "../../components/containers/general.containers";
// import { SafeArea } from "../../components/spacers and globals/safe-area.component";
// import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
// import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
// import { Text } from "../../infrastructure/typography/text.component";
// import { Regular_CTA } from "../../components/ctas/regular.cta";
// import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

// import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
// import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";
// import { GeolocationContext } from "../../infrastructure/services/geolocation/geolocation.context";
// import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";

// export default function Different_Delivery_Address_View() {
//   const theme = useTheme();
//   const tabBarHeight = useBottomTabBarHeight();
//   const navigation = useNavigation();

//   const [scrollEnabled, setScrollEnabled] = useState(true);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   // selectedAddress = { formatted_address, lat, lng, place_id }

//   const { deviceLat, deviceLng } = useContext(GeolocationContext);
//   const { onTaxes } = useContext(PaymentsContext);
//   const {
//     setDifferentAddress,
//     handlingDeliveryOption,
//     myOrder,
//     isLoading,
//     isCheckoutLoading,
//     setShip_to_different_address,
//     ship_to_different_address,
//   } = useContext(OrdersContext);

//   const { buildShipToFromGooglePlace, user } = useContext(
//     AuthenticationContext
//   );

//   const { customer_address } = myOrder || {};
//   const CTA_HEIGHT = 65; // ✅ fixed height so it never shrinks
//   return (
//     <SafeArea
//       background_color={theme.colors.bg.elements_bg}
//       style={{ flex: 1 }}
//     >
//       {isCheckoutLoading ? (
//         <Global_activity_indicator
//           caption="Wait, we are working with your new delivery address..."
//           caption_width="65%"
//         />
//       ) : (
//         <KeyboardAvoidingView
//           style={{ flex: 1 }}
//           behavior={Platform.OS === "ios" ? "padding" : undefined}
//           keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
//         >
//           <Container
//             width="100%"
//             height="100%"
//             color={theme.colors.bg.elements_bg}
//             justify="flex-start"
//             align="center"
//           >
//             <Exit_Header_With_Label
//               label="Delivery Address"
//               action={() => navigation.goBack()}
//             />

//             {/* ✅ Scrollable content */}
//             <ScrollView
//               style={{ flex: 1, width: "100%" }}
//               contentContainerStyle={{
//                 flexGrow: 1,
//                 paddingTop: 44, // ✅ space from header
//                 paddingBottom: 16,
//               }}
//               keyboardShouldPersistTaps="handled"
//               scrollEnabled={scrollEnabled}
//             >
//               <Container
//                 width="100%"
//                 //   color="green"
//                 color={theme.colors.bg.elements_bg}
//                 justify="flex-start" // ✅
//                 align="flex-start"
//                 style={{ paddingVertical: 12 }}
//               >
//                 <Spacer position="left" size="large">
//                   <Text variant="raleway_bold_20">
//                     Do you want to enter a different delivery address?
//                   </Text>
//                   <Spacer position="top" size="medium" />
//                   <Text variant="raleway_medium_18">Go ahead!</Text>
//                 </Spacer>
//               </Container>

//               {/* ✅ SPACE BETWEEN BLOCKS */}
//               <Spacer position="top" size="large" />
//               <Spacer position="top" size="large" />
//               <Spacer position="top" size="large" />

//               <Container
//                 width="100%"
//                 //   color="red"
//                 color={theme.colors.bg.elements_bg}
//                 justify="flex-start" // ✅
//                 align="center"
//                 style={{ paddingVertical: 10 }}
//               >
//                 {Platform.OS === "ios" && (
//                   <View
//                     style={{
//                       width: "93%",
//                       alignSelf: "center",
//                       position: "relative",
//                       overflow: "visible",
//                       zIndex: 9999,
//                       elevation: 9999,
//                     }}
//                   >
//                     <GooglePlacesAutocomplete
//                       placeholder="New address for delivery"
//                       query={{
//                         key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY,
//                         language: "en",
//                         components: "country:us",
//                         location: `${deviceLat},${deviceLng}`,
//                         radius: 50000, // meters (~31 miles)
//                         types: "geocode",
//                       }}
//                       fetchDetails
//                       onPress={(data, details = null) => {
//                         const formatted =
//                           details?.formatted_address ?? data.description;

//                         const shipToDA = buildShipToFromGooglePlace({
//                           details: details,
//                           user: {
//                             name: `${user.first_name} ${user.last_name}`,
//                             phone: user.phone_number,
//                           },
//                         });

//                         console.log(
//                           "SHIP TO DIFFERENT ADDRESS:",
//                           JSON.stringify(shipToDA, null, 2)
//                         );

//                         setShip_to_different_address(shipToDA);

//                         const lat = details?.geometry?.location?.lat;
//                         const lng = details?.geometry?.location?.lng;

//                         // consider valid only if we have formatted + coords
//                         if (
//                           formatted &&
//                           typeof lat === "number" &&
//                           typeof lng === "number"
//                         ) {
//                           setDifferentAddress(formatted);

//                           setSelectedAddress({
//                             formatted_address: formatted,
//                             lat,
//                             lng,
//                             place_id: details?.place_id ?? data?.place_id,
//                           });
//                         } else {
//                           setSelectedAddress(null);
//                         }
//                       }}
//                       textInputProps={{
//                         onChangeText: () => {
//                           // user is typing again -> invalidate selection until they tap a suggestion
//                           setSelectedAddress(null);
//                         },
//                       }}
//                       styles={{
//                         textInput: {
//                           width: "100%",
//                           height: 50,
//                           borderBottomWidth: 1,
//                           borderBottomColor: theme.colors.inputs.bottom_lines,
//                           backgroundColor: "transparent",

//                           paddingLeft: 5, // ✅ remove left inset
//                           paddingRight: 0,
//                           paddingVertical: 0, // optional: tighter vertical alignment
//                           marginLeft: 0, // just in case
//                           textAlign: "left", // explicit
//                         },
//                       }}
//                       enablePoweredByContainer={false}
//                       keyboardShouldPersistTaps="handled"
//                       minLength={1}
//                     />
//                   </View>
//                 )}
//                 {Platform.OS === "android" && (
//                   <View
//                     style={{
//                       width: "93%",
//                       alignSelf: "center",
//                       position: "relative",
//                       overflow: "visible",
//                       zIndex: 9999,
//                       elevation: 9999,
//                     }}
//                     pointerEvents="box-none"
//                   >
//                     <GooglePlacesAutocomplete
//                       placeholder="New delivery address"
//                       fetchDetails
//                       listViewDisplayed="auto" // you can keep true while debugging
//                       keyboardShouldPersistTaps="handled"
//                       enablePoweredByContainer={false}
//                       minLength={2}
//                       debounce={250}
//                       query={{
//                         key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY,
//                         language: "en",
//                         components: "country:us",
//                         location: `${deviceLat},${deviceLng}`,
//                         radius: 50000,
//                       }}
//                       textInputProps={{
//                         onFocus: () => setScrollEnabled(false),
//                         onBlur: () => setScrollEnabled(true),
//                         onChangeText: (t) => {
//                           console.log("typing:", t);
//                           setSelectedAddress(null);
//                         },
//                       }}
//                       onPress={(data, details = null) => {
//                         const formatted =
//                           details?.formatted_address ?? data.description;

//                         const shipToDA = buildShipToFromGooglePlace({
//                           details: details,
//                           user: {
//                             name: `${user.first_name} ${user.last_name}`,
//                             phone: user.phone_number,
//                           },
//                         });

//                         console.log(
//                           "SHIP TO DIFFERENT ADDRESS:",
//                           JSON.stringify(shipToDA, null, 2)
//                         );

//                         setShip_to_different_address(shipToDA);

//                         const lat = details?.geometry?.location?.lat;
//                         const lng = details?.geometry?.location?.lng;

//                         // consider valid only if we have formatted + coords
//                         if (
//                           formatted &&
//                           typeof lat === "number" &&
//                           typeof lng === "number"
//                         ) {
//                           setDifferentAddress(formatted);

//                           setSelectedAddress({
//                             formatted_address: formatted,
//                             lat,
//                             lng,
//                             place_id: details?.place_id ?? data?.place_id,
//                           });
//                         } else {
//                           setSelectedAddress(null);
//                         }
//                       }}
//                       styles={{
//                         container: { flex: 0, width: "100%" },
//                         textInputContainer: {
//                           width: "100%",
//                           paddingHorizontal: 0,
//                         },
//                         textInput: {
//                           width: "100%",
//                           height: 50,
//                           borderBottomWidth: 0.5,
//                           borderBottomColor: theme.colors.inputs.bottom_lines,
//                           backgroundColor: "transparent",
//                           paddingLeft: 5,
//                         },
//                         listView: {
//                           position: "absolute",
//                           top: 50,
//                           left: 0,
//                           right: 0,
//                           maxHeight: 260,
//                           zIndex: 999999,
//                           elevation: 999999,
//                           backgroundColor: theme.colors.bg.elements_bg,
//                         },
//                       }}
//                     />
//                   </View>
//                 )}
//               </Container>

//               {/* filler pushes CTA down */}
//               <View style={{ flex: 1 }} />
//             </ScrollView>

//             <Container
//               width="100%"
//               color={theme.colors.bg.elements_bg}
//               justify="center"
//               align="center"
//               style={{
//                 paddingBottom: 5, // ensure space above tab bar or at least some padding
//                 paddingTop: 8,
//               }}
//             >
//               {selectedAddress ? (
//                 <Regular_CTA
//                   width="95%"
//                   height={CTA_HEIGHT}
//                   color={theme.colors.brand.primary}
//                   border_radius={"40px"}
//                   caption="Continue"
//                   caption_text_variant="dm_sans_bold_20_white"
//                   action={async () => {
//                     await handlingDeliveryOption({
//                       navigation,
//                       onTaxes,
//                       differentAddress: selectedAddress.formatted_address,
//                       customer_address,
//                     });
//                   }}
//                 />
//               ) : (
//                 // optional: keep spacing so layout doesn't jump
//                 <View style={{ height: CTA_HEIGHT }} />
//               )}
//             </Container>
//           </Container>
//         </KeyboardAvoidingView>
//       )}
//     </SafeArea>
//   );
// }
