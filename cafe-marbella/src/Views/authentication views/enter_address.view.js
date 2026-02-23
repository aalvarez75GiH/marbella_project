import React, { useContext, useState } from "react";
import { useTheme } from "styled-components/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Platform, KeyboardAvoidingView, ScrollView, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Regular_CTA } from "../../components/ctas/regular.cta";
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

  const placesQuery = {
    key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY,
    language: "en",
    components: "country:us",
    types: "geocode",
    ...(typeof deviceLat === "number" && typeof deviceLng === "number"
      ? { location: `${deviceLat},${deviceLng}`, radius: 50000 }
      : {}),
  };

  const debugPlaces = async (text) => {
    try {
      const key = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY;
      const url =
        `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
        `?input=${encodeURIComponent(text)}` +
        `&key=${encodeURIComponent(key)}` +
        `&language=en` +
        `&components=country:us`;

      const res = await fetch(url);
      const json = await res.json();
      console.log("PLACES DEBUG:", json?.status, json?.error_message);
      console.log("PLACES DEBUG predictions:", json?.predictions?.length);
    } catch (e) {
      console.log("PLACES DEBUG fetch error:", e?.message ?? e);
    }
  };

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
              paddingTop: 44,
              paddingBottom: 16,
            }}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={scrollEnabled}
            nestedScrollEnabled={true}
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
                {Platform.OS === "ios" && (
                  <GooglePlacesAutocomplete
                    onFail={(err) =>
                      console.log("PLACES FAIL:", JSON.stringify(err))
                    }
                    onNotFound={() => console.log("PLACES NOT FOUND")}
                    onTimeout={() => console.log("PLACES TIMEOUT")}
                    placeholder="Shipping address"
                    query={placesQuery}
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
                )}
                {Platform.OS === "android" && (
                  <View
                    style={{
                      width: "93%",
                      alignSelf: "center",
                      position: "relative",
                      overflow: "visible",
                      zIndex: 9999,
                      elevation: 9999,
                    }}
                    pointerEvents="box-none"
                  >
                    {Platform.OS === "android" && (
                      <GooglePlacesAutocomplete
                        placeholder="Shipping address"
                        fetchDetails
                        listViewDisplayed="auto" // you can keep true while debugging
                        keyboardShouldPersistTaps="handled"
                        enablePoweredByContainer={false}
                        minLength={2}
                        debounce={250}
                        query={{
                          key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY,
                          language: "en",
                          components: "country:us",
                          location: `${deviceLat},${deviceLng}`,
                          radius: 50000,
                        }}
                        textInputProps={{
                          onFocus: () => setScrollEnabled(false),
                          onBlur: () => setScrollEnabled(true),
                          onChangeText: (t) => {
                            console.log("typing:", t);
                            setSelectedAddress(null);
                          },
                        }}
                        onPress={(data, details = null) => {
                          const formatted =
                            details?.formatted_address ?? data.description;
                          const lat = details?.geometry?.location?.lat;
                          const lng = details?.geometry?.location?.lng;

                          if (
                            formatted &&
                            typeof lat === "number" &&
                            typeof lng === "number"
                          ) {
                            setUserToDB({ ...userToDB, address: formatted });
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
                        styles={{
                          container: { flex: 0, width: "100%" },
                          textInputContainer: {
                            width: "100%",
                            paddingHorizontal: 0,
                          },
                          textInput: {
                            width: "100%",
                            height: 50,
                            borderBottomWidth: 0.5,
                            borderBottomColor: theme.colors.inputs.bottom_lines,
                            backgroundColor: "transparent",
                            paddingLeft: 5,
                          },
                          listView: {
                            position: "absolute",
                            top: 50,
                            left: 0,
                            right: 0,
                            maxHeight: 260,
                            zIndex: 999999,
                            elevation: 999999,
                            backgroundColor: theme.colors.bg.elements_bg,
                          },
                        }}
                      />
                    )}
                  </View>
                )}
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
