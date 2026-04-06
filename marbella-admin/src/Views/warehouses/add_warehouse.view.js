import React, { use, useContext, useEffect, useState, useRef } from "react";
import {
  FlatList,
  View,
  SectionList,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text as RNText,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import {
  Container,
  Action_Container,
} from "../../components/containers/general.containers";
import { Just_Caption_Header } from "../../components/headers/just_caption.header.js";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { Underlined_CTA } from "../../components/ctas/underlined.cta.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";

import RightArrowIcon from "../../../assets/my_icons/chevron-right.svg";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { GeolocationContext } from "../../infrastructure/services/geolocation/geolocation.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context.js";

export default function Add_Warehouse_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute();
  const { coming_from } = route?.params ?? {};
  console.log("COMING FROM AT ADD WAREHOUSE:", coming_from);
  const { warehouseSelected, setWarehouseSelected } =
    useContext(WarehouseContext);
  const [isWarehouseNameFocused, setWarehouseNameFocused] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressText, setAddressText] = useState("");
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const [error, setError] = useState(null);

  const warehouseNameInputRef = useRef(null);
  const addressDataInputRef = useRef(null);
  const emailDataInputRef = useRef(null);
  const openAtInputRef = useRef(null);
  const closeAtInputRef = useRef(null);

  const { deviceLat, deviceLng } = useContext(GeolocationContext);
  const { formatPhone } = useContext(GlobalContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      warehouseNameInputRef.current?.focus();
    }, 100); // small delay helps with navigation transitions

    return () => clearTimeout(timer);
  }, []);

  const warehouseFormattedAddress =
    warehouseSelected?.geo?.formatted_address ||
    warehouseSelected?.physical_address ||
    "";

  useEffect(() => {
    setAddressText(warehouseFormattedAddress || "");

    if (addressDataInputRef.current) {
      addressDataInputRef.current.setAddressText(
        warehouseFormattedAddress || ""
      );
    }
  }, [warehouseFormattedAddress]);

  console.log(
    "WAREHOUSE SELECTED IN DETAILS VIEW:",
    JSON.stringify(warehouseSelected, null, 2)
  );

  const placesQuery = {
    key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY,
    language: "en",
    components: "country:us",
    types: "geocode",
    ...(typeof deviceLat === "number" && typeof deviceLng === "number"
      ? { location: `${deviceLat},${deviceLng}`, radius: 50000 }
      : {}),
  };

  console.log("PLACES QUERY:", placesQuery);

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          justify="flex-start"
          align="center"
        >
          <Go_Back_Header label="" action={() => navigation.goBack()} />

          <ScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{
              paddingBottom: 40,
              alignItems: "center",
            }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            scrollEnabled={scrollEnabled}
          >
            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />
            <Container
              width="100%"
              color={theme.colors.bg.elements_bg}
              align="flex-start"
            >
              <Spacer position="left" size="extraLarge">
                <Text variant="raleway_bold_18" textAlign="center">
                  Warehouse information
                </Text>
              </Spacer>
            </Container>

            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />

            <Container
              width="100%"
              color={theme.colors.bg.elements_bg}
              align="center"
              justify="flex-start"
              direction="column"
              style={{ overflow: "visible" }}
            >
              <DataInput
                ref={warehouseNameInputRef}
                label="Warehouse name"
                value={warehouseSelected.warehouse_name}
                onChangeText={(value) => {
                  setWarehouseSelected({
                    ...warehouseSelected,
                    warehouse_name: value,
                  });
                }}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.3px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType="default"
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="givenName"
                autoComplete="name"
                returnKeyType="done"
                blurOnSubmit
                style={{
                  backgroundColor: "#F5F5F5",
                  fontSize: 16,
                }}
                contentStyle={{
                  fontFamily: "ralewayBold",
                  fontSize: 16,
                }}
              />

              <Spacer position="top" size="large" />

              {Platform.OS === "ios" && (
                <View
                  style={{
                    width: "93%",
                    alignSelf: "center",
                    zIndex: 9999,
                    elevation: 9999,
                  }}
                >
                  <GooglePlacesAutocomplete
                    ref={addressDataInputRef}
                    placeholder="Warehouse address"
                    query={placesQuery}
                    fetchDetails
                    enablePoweredByContainer={false}
                    keyboardShouldPersistTaps="handled"
                    minLength={1}
                    onFail={(err) =>
                      console.log("PLACES FAIL:", JSON.stringify(err))
                    }
                    onNotFound={() => console.log("PLACES NOT FOUND")}
                    onTimeout={() => console.log("PLACES TIMEOUT")}
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
                        setWarehouseSelected({
                          ...warehouseSelected,
                          physical_address: formatted,
                          //   geo: {
                          //     formatted_address: formatted,
                          //     lat,
                          //     lng,
                          //     place_id: details?.place_id ?? data?.place_id,
                          //   },
                        });

                        setSelectedAddress({
                          formatted_address: formatted,
                          lat,
                          lng,
                          place_id: details?.place_id ?? data?.place_id,
                        });
                      } else {
                        setSelectedAddress(null);
                      }

                      setScrollEnabled(true);
                    }}
                    textInputProps={{
                      autoCorrect: false,
                      autoCapitalize: "none",
                      onFocus: () => setScrollEnabled(false),
                      onBlur: () => setScrollEnabled(true),
                    }}
                    styles={{
                      container: {
                        flex: 0,
                        width: "100%",
                        zIndex: 1000,
                      },
                      textInputContainer: {
                        width: "100%",
                        paddingHorizontal: 0,
                        backgroundColor: "transparent",
                      },
                      textInput: {
                        width: "100%",
                        height: 50,
                        borderBottomWidth: 0.5,
                        borderBottomColor: theme.colors.inputs.bottom_lines,
                        backgroundColor: "transparent",
                        paddingLeft: 5,
                        paddingRight: 0,
                        paddingVertical: 0,
                        marginLeft: 0,
                        textAlign: "left",
                        fontFamily: "ralewayBold",
                        fontSize: 16,
                        color: "#000",
                      },
                      listView: {
                        backgroundColor: "#FFFFFF",
                        zIndex: 2000,
                        elevation: 5,
                      },
                    }}
                  />
                </View>
              )}
              <Spacer position="top" size="large" />
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
                      ref={addressDataInputRef}
                      placeholder="Warehouse address"
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
                        value: addressText,
                        onFocus: () => setScrollEnabled(false),
                        onBlur: () => setScrollEnabled(true),
                        onChangeText: (t) => {
                          setAddressText(t); // ✅ sync state
                          setSelectedAddress(null);
                        },
                      }}
                      onPress={(data, details = null) => {
                        const formatted =
                          details?.formatted_address ?? data.description;
                        setAddressText(formatted); // ✅ keep synced
                        const lat = details?.geometry?.location?.lat;
                        const lng = details?.geometry?.location?.lng;

                        if (
                          formatted &&
                          typeof lat === "number" &&
                          typeof lng === "number"
                        ) {
                          setWarehouseSelected({
                            ...warehouseSelected,
                            physical_address: formatted,
                            // geo: {
                            //   formatted_address: formatted,
                            //   lat,
                            //   lng,
                            //   place_id: details?.place_id ?? data?.place_id,
                            // },
                          });
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
                          fontFamily: "ralewayBold",
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
                  {addressText.length > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        setAddressText("");
                        addressDataInputRef.current?.setAddressText("");
                        setSelectedAddress(null);
                        requestAnimationFrame(() => {
                          addressDataInputRef.current?.focus?.();
                        });
                      }}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: 12,
                        width: 25,
                        height: 25,
                        borderRadius: 14,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#EAEAEA",
                        zIndex: 999999,
                        elevation: 999999,
                      }}
                    >
                      <RNText
                        style={{
                          fontSize: 10,
                          color: "#333",
                          fontWeight: "bold",
                        }}
                      >
                        ✕
                      </RNText>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <Spacer position="top" size="large" />
              <DataInput
                ref={emailDataInputRef}
                label="Email"
                value={warehouseSelected.warehouse_information.email}
                onChangeText={(value) => {
                  setWarehouseSelected({
                    ...warehouseSelected,
                    warehouse_information: {
                      ...warehouseSelected.warehouse_information,
                      email: value,
                    },
                  });
                }}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.3px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                autoComplete="email"
                returnKeyType="done"
                blurOnSubmit
                style={{
                  backgroundColor: "#F5F5F5",
                  fontSize: 16,
                }}
                contentStyle={{
                  fontFamily: "ralewayBold",
                  fontSize: 16,
                }}
              />
              <Spacer position="top" size="medium" />
              <DataInput
                ref={emailDataInputRef}
                label="Phone number"
                value={warehouseSelected.warehouse_information.phone}
                onChangeText={(value) => {
                  const formatted = formatPhone(value);
                  setWarehouseSelected({
                    ...warehouseSelected,
                    warehouse_information: {
                      ...warehouseSelected.warehouse_information,
                      phone: formatted,
                    },
                  });
                }}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.3px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType={
                  Platform.OS === "ios" ? "number-pad" : "phone-pad"
                }
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="telephoneNumber"
                autoComplete="tel"
                returnKeyType="done"
                blurOnSubmit
                style={{
                  backgroundColor: "#F5F5F5",
                  fontSize: 16,
                }}
                contentStyle={{
                  fontFamily: "ralewayBold",
                  fontSize: 16,
                }}
              />
              <Spacer position="top" size="medium" />
              <DataInput
                ref={openAtInputRef}
                label="Open At:"
                value={warehouseSelected.warehouse_information.opening_time}
                onChangeText={(value) => {
                  setWarehouseSelected({
                    ...warehouseSelected,
                    warehouse_information: {
                      ...warehouseSelected.warehouse_information,
                      opening_time: value,
                    },
                  });
                }}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.3px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType="default"
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="givenName"
                autoComplete="name"
                returnKeyType="done"
                blurOnSubmit
                style={{
                  backgroundColor: "#F5F5F5",
                  fontSize: 16,
                }}
                contentStyle={{
                  fontFamily: "ralewayBold",
                  fontSize: 16,
                }}
              />
              <Spacer position="top" size="medium" />
              <DataInput
                ref={openAtInputRef}
                label="Close At:"
                value={warehouseSelected.warehouse_information.closing_time}
                onChangeText={(value) => {
                  setWarehouseSelected({
                    ...warehouseSelected,
                    warehouse_information: {
                      ...warehouseSelected.warehouse_information,
                      closing_time: value,
                    },
                  });
                }}
                border_color={theme.colors.inputs.bottom_lines_disabled}
                underlineColor={theme.colors.inputs.bottom_lines_disabled}
                border_width={"0.3px"}
                activeUnderlineColor={theme.colors.ui.primary}
                keyboardType="default"
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="givenName"
                autoComplete="name"
                returnKeyType="done"
                blurOnSubmit
                style={{
                  backgroundColor: "#F5F5F5",
                  fontSize: 16,
                }}
                contentStyle={{
                  fontFamily: "ralewayBold",
                  fontSize: 16,
                }}
              />
              <Spacer position="top" size="medium" />
              <Action_Container
                width="95%"
                // height="15%"
                padding_vertical="25px"
                color={theme.colors.bg.screens_bg}
                // color={"lightgreen"}
                justify="center"
                align="flex-start"
                direction="row"
                onPress={() =>
                  navigation.navigate("Warehouse_Representative_View")
                }
              >
                <Container
                  width="75%"
                  style={{ alignSelf: "stretch" }}
                  color={theme.colors.bg.screens_bg}
                  //   color={"red"}
                  justify="center"
                  align="flex-start"
                >
                  <Spacer position="left" size="large">
                    <Text variant="raleway_bold_18">
                      Warehouse Representative
                    </Text>
                  </Spacer>
                </Container>
                <Container
                  width="25%"
                  style={{ alignSelf: "stretch" }}
                  color={theme.colors.bg.screens_bg}
                  //   color={"blue"}
                  justify="center"
                  align="flex-end"
                >
                  <RightArrowIcon width={20} height={20} />
                </Container>
              </Action_Container>
              <Action_Container
                width="95%"
                // height="15%"
                padding_vertical="25px"
                color={theme.colors.bg.screens_bg}
                // color={"lightgreen"}
                justify="center"
                align="flex-start"
                direction="row"
                onPress={() =>
                  navigation.navigate("Warehouse_Inventory_View", {
                    coming_from: coming_from,
                  })
                }
              >
                <Container
                  width="75%"
                  style={{ alignSelf: "stretch" }}
                  color={theme.colors.bg.screens_bg}
                  //   color={"red"}
                  justify="center"
                  align="flex-start"
                >
                  <Spacer position="left" size="large">
                    <Text variant="raleway_bold_18">Warehouse Products</Text>
                  </Spacer>
                </Container>
                <Container
                  width="25%"
                  style={{ alignSelf: "stretch" }}
                  color={theme.colors.bg.screens_bg}
                  //   color={"blue"}
                  justify="center"
                  align="flex-end"
                >
                  <RightArrowIcon width={20} height={20} />
                </Container>
              </Action_Container>
            </Container>
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
