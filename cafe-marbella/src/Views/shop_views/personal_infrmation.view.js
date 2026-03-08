import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Snackbar } from "react-native-paper";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
import { put_update_userinfo_Request } from "../../infrastructure/services/authentication/authentication.sevices.js";
import { auth } from "../../../fb.js";

import ClearIcon from "../../../assets/my_icons/delete_clear_icon.svg";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { GeolocationContext } from "../../infrastructure/services/geolocation/geolocation.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

export default function Personal_Information_View() {
  const navigation = useNavigation();
  const theme = useTheme();

  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [phoneError, setPhoneError] = useState(null);

  const didInitRef = useRef(false);
  const didSetAddressTextRef = useRef(false);
  const scrollRef = useRef(null);
  const addressYRef = useRef(0);
  const placesRef = useRef(null);

  const { setUserToDB, userToDB, user, handleUpdate, setUser, isLoading } =
    useContext(AuthenticationContext);

  const { deviceLat, deviceLng } = useContext(GeolocationContext);
  console.log("Device location at Personal Info View:", {
    deviceLat,
    deviceLng,
  });

  const { snackbar, showSnackbar, hideSnackbar } = useContext(GlobalContext);

  useFocusEffect(
    useCallback(() => {
      const syncAfterEmailVerify = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        // If no pending email, don't do anything
        const pendingEmail = await AsyncStorage.getItem("pending_email");
        if (!pendingEmail) return;

        // Pull latest user data from Firebase
        await currentUser.reload();
        const firebaseEmail = (currentUser.email ?? "").toLowerCase();

        // If email isn't updated yet, user probably hasn't clicked the link
        if (firebaseEmail !== pendingEmail.toLowerCase()) return;

        // Email is now updated in Firebase -> sync DB
        const idToken = await currentUser.getIdToken(true);

        // IMPORTANT: don't send email; backend should set email from admin.getUser(uid)
        const res = await put_update_userinfo_Request({ ...userToDB }, idToken);

        if (res.ok) {
          setUser(res.data);
          await AsyncStorage.removeItem("pending_email"); // ✅ clear pending state
          Alert.alert("Success", "Your email was updated.");
        }
      };

      syncAfterEmailVerify();
    }, [userToDB, setUser])
  );

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
        createdAt:
          user?.createdAt ?? prev?.createdAt ?? new Date().toISOString(),
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

  //   ************** PHONE VALIDATION LOGIC ***************
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
      {isLoading && (
        <Global_activity_indicator
          caption="Wait, we are updating your info..."
          caption_width="65%"
        />
      )}
      {!isLoading && (
        <>
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
                keyboardType="email-address"
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
                keyboardType={
                  Platform.OS === "ios" ? "number-pad" : "phone-pad"
                }
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

                        setUserToDB((prev) => ({
                          ...prev,
                          address: formatted,
                        }));
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
                      styles={{
                        container: {
                          flex: 0,
                          width: "95%", // 👈 try matching what DataInput visually uses
                          alignSelf: "center",
                        },
                        textInputContainer: {
                          width: "100%",
                          paddingHorizontal: 0,
                        },
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
                          ? {
                              location: `${deviceLat},${deviceLng}`,
                              radius: 50000,
                            }
                          : {}),
                      }}
                      onPress={(data, details = null) => {
                        Keyboard.dismiss();
                        const formatted =
                          details?.formatted_address ?? data.description;
                        const lat = details?.geometry?.location?.lat;
                        const lng = details?.geometry?.location?.lng;

                        setUserToDB((prev) => ({
                          ...prev,
                          address: formatted,
                        }));

                        if (
                          typeof lat === "number" &&
                          typeof lng === "number"
                        ) {
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
                        textInputContainer: {
                          width: "100%",
                          paddingHorizontal: 0,
                        },
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

              {!snackbar.visible && (
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
                    action={async () => {
                      const res = await handleUpdate(userToDB);

                      if (!res?.ok) {
                        if (res.error === "requires_recent_login") {
                          showSnackbar({
                            message:
                              "Please log in again to change your email.",
                            actionLabel: "Log in",
                            bgColor: "#B00020",
                            onAction: () => {
                              hideSnackbar();
                              navigation.navigate("Shop_Login_Users_View");
                            },
                          });
                          return;
                        }
                        if (res.error === "email_already_in_use") {
                          Alert.alert("This email is already in use.");
                          return;
                        }
                        Alert.alert("Update failed", String(res.error));
                        return;
                      }

                      if (res.emailChanged) {
                        navigation.navigate("Email_Verification_Sent_View", {
                          pendingEmail: res.pendingEmail,
                        });
                        return;
                      }

                      // setVisible(true);
                      showSnackbar({
                        message: "Your information was updated successfully.",
                        actionLabel: "OK",
                        bgColor: theme.colors.ui.primary,
                        onAction: () => {
                          hideSnackbar();
                          navigation.goBack();
                        },
                      });
                      // Alert.alert("Updated", "Your info was updated.");
                    }}
                  />
                </Container>
              )}
              <Snackbar
                visible={snackbar.visible}
                onDismiss={() => {}}
                duration={Number.POSITIVE_INFINITY}
                action={{
                  label: snackbar.actionLabel,
                  onPress: () => {
                    if (snackbar.onAction) {
                      snackbar.onAction();
                    } else {
                      hideSnackbar();
                    }
                  },
                }}
                style={{
                  minHeight: 80,
                  marginBottom: 30,
                  backgroundColor: snackbar.bgColor,
                }}
              >
                {snackbar.message}
              </Snackbar>
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}
    </SafeArea>
  );
}
