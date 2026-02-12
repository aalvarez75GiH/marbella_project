import React, { useContext, useState } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Platform, KeyboardAvoidingView, ScrollView, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Text } from "../../infrastructure/typography/text.component";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { GeolocationContext } from "../../infrastructure/services/geolocation/geolocation.context";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";
export default function Enter_Address_View() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { comingFrom, returnTo } = route?.params ?? {};

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const { setUserToDB, userToDB } = useContext(AuthenticationContext);
  const { deviceLat, deviceLng } = useContext(GeolocationContext);
  const CTA_HEIGHT = 65; // ✅ fixed height so it never shrinks

  console.log("PLACES KEY:", process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY);
  console.log("DEVICE LOCATION for PLACES biasing:", deviceLat, deviceLng);
  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
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
        >
          <Go_Back_Header label="" action={() => navigation.goBack()} />

          {/* ✅ Scrollable content */}
          <ScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: 44, // ✅ space from header
              paddingBottom: 16,
            }}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={scrollEnabled}
          >
            <Container
              width="100%"
              //   color="green"
              color={theme.colors.bg.elements_bg}
              justify="flex-start" // ✅
              align="flex-start"
              style={{ paddingVertical: 12 }}
            >
              <Spacer position="left" size="large">
                <Text variant="raleway_bold_20">Enter your address</Text>
              </Spacer>
            </Container>

            {/* ✅ SPACE BETWEEN BLOCKS */}
            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />

            <Container
              width="100%"
              //   color="red"
              color={theme.colors.bg.elements_bg}
              justify="flex-start" // ✅
              align="center"
              style={{ paddingVertical: 10 }}
            >
              <View
                style={{
                  width: "93%",
                  alignSelf: "center",
                  position: "relative",
                  overflow: "visible",
                  zIndex: 9999,
                  elevation: 9999,
                }}
              >
                <GooglePlacesAutocomplete
                  onFail={(err) => console.log("PLACES FAIL:", err)}
                  placeholder="Shipping address"
                  query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY,
                    language: "en",
                    components: "country:us",
                    location: `${deviceLat},${deviceLng}`,
                    radius: 50000, // meters (~31 miles)
                    types: "geocode",
                  }}
                  fetchDetails
                  onPress={(data, details = null) => {
                    const formatted =
                      details?.formatted_address ?? data.description;

                    const lat = details?.geometry?.location?.lat;
                    const lng = details?.geometry?.location?.lng;

                    // consider valid only if we have formatted + coords
                    if (
                      formatted &&
                      typeof lat === "number" &&
                      typeof lng === "number"
                    ) {
                      setUserToDB({
                        ...userToDB,
                        address: formatted,
                      });
                      // setDifferentAddress(formatted);

                      setSelectedAddress({
                        formatted_address: formatted,
                        lat,
                        lng,
                        place_id: details?.place_id ?? data?.place_id,
                      });
                    } else {
                      setSelectedAddress(null);
                    }
                  }}
                  textInputProps={{
                    onChangeText: () => {
                      // user is typing again -> invalidate selection until they tap a suggestion
                      setSelectedAddress(null);
                    },
                  }}
                  styles={{
                    textInput: {
                      width: "100%",
                      height: 50,
                      borderBottomWidth: 0.5,
                      borderBottomColor: theme.colors.inputs.bottom_lines,
                      backgroundColor: "transparent",

                      paddingLeft: 5, // ✅ remove left inset
                      paddingRight: 0,
                      paddingVertical: 0, // optional: tighter vertical alignment
                      marginLeft: 0, // just in case
                      textAlign: "left", // explicit
                    },
                  }}
                  enablePoweredByContainer={false}
                  keyboardShouldPersistTaps="handled"
                  minLength={1}
                />
              </View>
            </Container>

            {/* filler pushes CTA down */}
            <View style={{ flex: 1 }} />
          </ScrollView>

          {/* ✅ Fixed footer CTA (outside ScrollView) */}
          <Container
            width="100%"
            color={theme.colors.bg.elements_bg}
            justify="center"
            align="center"
            style={{
              paddingBottom: 16,
              paddingTop: 8,
            }}
          >
            {selectedAddress ? (
              <Regular_CTA
                width="95%"
                height={CTA_HEIGHT}
                color={theme.colors.brand.primary}
                border_radius={"40px"}
                caption="Continue"
                caption_text_variant="dm_sans_bold_20_white"
                action={async () =>
                  //   navigation.navigate("Enter_Phone_Number_View")
                  navigation.navigate("AuthModal", {
                    screen: "Enter_Phone_Number_View",
                    params: { returnTo },
                  })
                }
              />
            ) : (
              // optional: keep spacing so layout doesn't jump
              <View style={{ height: CTA_HEIGHT }} />
            )}
          </Container>
        </Container>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
