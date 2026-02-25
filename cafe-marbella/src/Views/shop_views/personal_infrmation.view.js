import React, {
  use,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  FlatList,
  View,
  SectionList,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { Container } from "../../components/containers/general.containers";
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

import ClearIcon from "../../../assets/my_icons/delete_clear_icon.svg";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { GeolocationContext } from "../../infrastructure/services/geolocation/geolocation.context.js";

export default function Personal_Information_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute();
  const { comingFrom, returnTo } = route?.params ?? {};

  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [phoneError, setPhoneError] = useState(null);

  const didInitRef = useRef(false);
  const didSetAddressTextRef = useRef(false);
  const scrollRef = useRef(null);
  const addressYRef = useRef(0);
  const placesRef = useRef(null);
  const didAutoScrollAddressRef = useRef(false);
  const lastScrollYRef = useRef(0);

  const { setUserToDB, userToDB, user } = useContext(AuthenticationContext);

  useFocusEffect(
    useCallback(() => {
      if (didInitRef.current) return;
      didInitRef.current = true;

      setUserToDB((prev) => ({
        ...prev,
        // keep anything already in prev, but preload from user
        first_name: user?.first_name ?? prev?.first_name ?? "",
        last_name: user?.last_name ?? prev?.last_name ?? "",
        email: user?.email ?? prev?.email ?? "",
        phone_number: user?.phone_number ?? prev?.phone_number ?? "",
        address: user?.address ?? prev?.address ?? "",
        display_name:
          user?.display_name ?? user?.first_name ?? prev?.display_name ?? "",
      }));
    }, [setUserToDB, user])
  );

  useEffect(() => {
    if (Platform.OS !== "android") return;
    if (didSetAddressTextRef.current) return;

    const addr = userToDB?.address ?? "";
    if (!addr) return;

    placesRef.current?.setAddressText(addr);

    didSetAddressTextRef.current = true; // ✅ IMPORTANT
  }, [userToDB?.address]);

  console.log("USER AT PERSONAL INFO VIEW:", JSON.stringify(user, null, 2));
  console.log(
    "USER TO DB AT PERSONAL INFO VIEW:",
    JSON.stringify(userToDB, null, 2)
  );

  const { deviceLat, deviceLng } = useContext(GeolocationContext);
  console.log("Device location at Personal Info View:", {
    deviceLat,
    deviceLng,
  });

  //   ************** PHONE VALIDATION LOGIC ***************
  //   const showCTA = isPhoneComplete; // ✅ CTA only when complete
  const onlyDigits = (s = "") => String(s).replace(/\D/g, "");

  const formatPhone = (input = "") => {
    const digits = onlyDigits(input).slice(0, 10);

    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)})${digits.slice(3)}`;
    return `(${digits.slice(0, 3)})${digits.slice(3, 6)}.${digits.slice(6)}`;
  };

  const phoneDigits = useMemo(
    () => onlyDigits(userToDB?.phone_number || ""),
    [userToDB?.phone_number]
  );
  const isPhoneComplete = phoneDigits.length === 10;
  // **************************************************************

  //   ************** GOOGLE AUTO COMPLETE VALIDATION LOGIC ***************

  const placesQuery = {
    key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY,
    language: "en",
    components: "country:us",
    types: "geocode",
    ...(typeof deviceLat === "number" && typeof deviceLng === "number"
      ? { location: `${deviceLat},${deviceLng}`, radius: 50000 }
      : {}),
  };

  const androidPlacesQuery = {
    key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY,
    language: "en",
    components: "country:us",
    ...(typeof deviceLat === "number" && typeof deviceLng === "number"
      ? { location: `${deviceLat},${deviceLng}`, radius: 50000 }
      : {}),
  };

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <Go_Back_Header label="" action={() => navigation.goBack()} />
      <Container
        width="100%"
        height="10%"
        color={theme.colors.bg.elements_bg}
        //color={"yellow"}
        align="flex-start"
      >
        <Spacer position="left" size="large">
          <Text variant="raleway_bold_18" textAlign="center">
            Personal information
          </Text>
        </Spacer>
      </Container>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // try 90–140
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={{ paddingBottom: 220 }} // space for keyboard + dropdown
          keyboardShouldPersistTaps="handled"
        >
          <Spacer position="top" size="large" />
          <DataInput
            label="First Name"
            value={userToDB?.first_name ?? ""}
            onChangeText={(value) => {
              setUserToDB((prev) => ({
                ...prev,
                first_name: value,
                display_name: value, // if you want display_name to track first_name
              }));
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
          />
          <DataInput
            label="Last Name"
            value={userToDB?.last_name ?? ""}
            onChangeText={(value) => {
              setUserToDB((prev) => ({
                ...prev,
                last_name: value,
              }));
            }}
            border_color={theme.colors.inputs.bottom_lines_disabled}
            underlineColor={theme.colors.inputs.bottom_lines_disabled}
            border_width={"0.3px"}
            activeUnderlineColor={theme.colors.ui.primary}
            keyboardType="default"
            autoCapitalize="words"
            autoCorrect={false}
            textContentType="familyName"
            autoComplete="name"
            returnKeyType="done"
            onFocus={() => setIsLastNameFocused(true)}
            onBlur={() => setIsLastNameFocused(false)}
            blurOnSubmit
          />
          <DataInput
            label="Email"
            value={userToDB?.email ?? ""}
            onChangeText={(value) => {
              setUserToDB((prev) => ({
                ...prev,
                email: value,
              }));
            }}
            // underlineColor={theme.colors.inputs.bottom_lines_disabled}
            border_color={theme.colors.inputs.bottom_lines_disabled}
            underlineColor={theme.colors.inputs.bottom_lines_disabled}
            border_width={"0.3px"}
            activeUnderlineColor={theme.colors.ui.primary}
            keyboardType="email"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            autoComplete="name"
            returnKeyType="done"
            onFocus={() => null}
            //   onFocus={() => setIsEmailFocused(true)}
            //   onBlur={() => setIsEmailFocused(false)}
            onBlur={() => null}
            blurOnSubmit
          />
          <DataInput
            label="Phone Number"
            value={userToDB?.phone_number ?? ""}
            onChangeText={(value) => {
              const formatted = formatPhone(value);
              setUserToDB((prev) => ({
                ...prev,
                phone_number: formatted,
              }));

              if (phoneError) setPhoneError(null);
            }}
            border_color={theme.colors.inputs.bottom_lines_disabled}
            underlineColor={theme.colors.inputs.bottom_lines_disabled}
            border_width={"0.3px"}
            activeUnderlineColor={theme.colors.ui.primary}
            keyboardType={Platform.OS === "ios" ? "number-pad" : "phone-pad"}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="telephoneNumber"
            autoComplete="tel"
            returnKeyType="done"
            onFocus={() => null}
            onBlur={() => null}
            blurOnSubmit
          />
          <Spacer position="top" size="extraLarge" />
          {Platform.OS === "ios" && (
            <Container
              width="100%"
              align="center"
              justify="center"
              color={theme.colors.bg.elements_bg}
              //   color={"red"}
            >
              <View
                onLayout={(e) => {
                  addressYRef.current = e.nativeEvent.layout.y;
                }}
                style={{
                  width: "100%",
                  zIndex: 999999,
                  elevation: 999999,
                  //   backgroundColor: "lightblue",
                }}
              >
                <GooglePlacesAutocomplete
                  ref={placesRef}
                  onFail={(err) =>
                    console.log("PLACES FAIL:", JSON.stringify(err))
                  }
                  onNotFound={() => console.log("PLACES NOT FOUND")}
                  onTimeout={() => console.log("PLACES TIMEOUT")}
                  placeholder="Address"
                  query={placesQuery}
                  fetchDetails
                  listViewDisplayed={true}
                  onPress={(data, details = null) => {
                    const formatted =
                      details?.formatted_address ?? data.description;

                    setUserToDB((prev) => ({ ...prev, address: formatted }));
                    setSelectedAddress({
                      formatted_address: formatted,
                      lat: details?.geometry?.location?.lat,
                      lng: details?.geometry?.location?.lng,
                      place_id: details?.place_id ?? data?.place_id,
                    });
                  }}
                  textInputProps={{
                    value: userToDB?.address ?? "", // ✅ populate it
                    onChangeText: (t) => {
                      // ✅ allow editing
                      setUserToDB((prev) => ({ ...prev, address: t }));
                      setSelectedAddress(null); // typing invalidates selection
                    },
                  }}
                  //   textInputProps={{
                  //     value: userToDB?.address ?? "",
                  //     autoCorrect: false,
                  //     blurOnSubmit: false,

                  //     onFocus: () => {
                  //       didAutoScrollAddressRef.current = false; // reset for this session

                  //       setTimeout(() => {
                  //         scrollRef.current?.scrollTo({
                  //           y: Math.max(addressYRef.current - 120, 0),
                  //           animated: true,
                  //         });
                  //       }, 250);
                  //     },

                  //     onChangeText: (t) => {
                  //       setUserToDB((prev) => ({ ...prev, address: t }));
                  //       setSelectedAddress(null);

                  //       // ✅ scroll only once when user crosses minLength
                  //       if (t.length >= 2 && !didAutoScrollAddressRef.current) {
                  //         didAutoScrollAddressRef.current = true;

                  //         setTimeout(() => {
                  //           scrollRef.current?.scrollTo({
                  //             y: Math.max(addressYRef.current - 120, 0),
                  //             animated: true,
                  //           });
                  //         }, 150);
                  //       }
                  //     },

                  //     onBlur: () => {
                  //       didAutoScrollAddressRef.current = false;
                  //     },
                  //   }}
                  styles={{
                    container: {
                      flex: 0,
                      width: "95%", // 👈 try matching what DataInput visually uses
                      alignSelf: "center",
                    },
                    textInputContainer: { width: "100%", paddingHorizontal: 0 },
                    textInput: {
                      width: "100%",
                      height: 50,
                      borderBottomWidth: 1,
                      borderBottomColor:
                        theme.colors.inputs.bottom_lines_disabled,
                      backgroundColor: "transparent",
                      paddingLeft: 0, // match DataInput padding
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
                  enablePoweredByContainer={false}
                  keyboardShouldPersistTaps="handled"
                  minLength={1}
                />
              </View>
            </Container>
          )}

          {Platform.OS === "android" && (
            <Container
              width="100%"
              align="center"
              justify="center"
              color={theme.colors.bg.elements_bg}
              //   color={"red"}
            >
              <View
                style={{ width: "100%", zIndex: 999999, elevation: 999999 }}
              >
                <GooglePlacesAutocomplete
                  ref={placesRef}
                  placeholder="Address"
                  fetchDetails
                  debounce={250}
                  minLength={2}
                  enablePoweredByContainer={false}
                  keyboardShouldPersistTaps="always"
                  listViewDisplayed={true}
                  keepResultsAfterBlur={true}
                  query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY,
                    language: "en",
                    components: "country:us",
                    ...(typeof deviceLat === "number" &&
                    typeof deviceLng === "number"
                      ? { location: `${deviceLat},${deviceLng}`, radius: 50000 }
                      : {}),
                  }}
                  onPress={(data, details = null) => {
                    Keyboard.dismiss();
                    const formatted =
                      details?.formatted_address ?? data.description;
                    const lat = details?.geometry?.location?.lat;
                    const lng = details?.geometry?.location?.lng;

                    setUserToDB((prev) => ({ ...prev, address: formatted }));

                    if (typeof lat === "number" && typeof lng === "number") {
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
                    container: {
                      flex: 0,
                      width: "95%", // 👈 try matching what DataInput visually uses
                      alignSelf: "center",
                    },
                    textInputContainer: { width: "100%", paddingHorizontal: 0 },
                    textInput: {
                      width: "100%",
                      height: 50,
                      borderBottomWidth: 1,
                      borderBottomColor:
                        theme.colors.inputs.bottom_lines_disabled,
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
                  renderRightButton={() => (
                    <TouchableOpacity
                      onPress={() => {
                        placesRef.current?.setAddressText("");
                        setUserToDB((prev) => ({ ...prev, address: "" }));
                        setSelectedAddress(null);
                      }}
                      style={{
                        justifyContent: "center",
                        paddingHorizontal: 12,
                      }}
                    >
                      <ClearIcon width={20} height={20} />
                    </TouchableOpacity>
                  )}
                />
              </View>
            </Container>
          )}

          {/* {isLastNameFocused && ( */}
          <Container
            width="100%"
            height="30%"
            justify="center"
            align="center"
            color={theme.colors.bg.elements_bg}
          >
            <Regular_CTA
              width="200px"
              height={"65px"}
              color={theme.colors.ui.primary}
              border_radius={"40px"}
              caption="Update"
              caption_text_variant="dm_sans_bold_20_white"
              action={() => null}
            />
          </Container>
          {/* )} */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
