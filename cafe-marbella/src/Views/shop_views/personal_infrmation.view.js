import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Snackbar } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { Container } from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
// import { put_update_userinfo_Request } from "../../infrastructure/services/authentication/authentication.sevices.js";
// import { auth } from "../../../fb.js";
import { Snack_Bar_Component } from "../../components/others/snack_bar.component.js";

import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { GeolocationContext } from "../../infrastructure/services/geolocation/geolocation.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

export default function Personal_Information_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { t } = useTranslation();

  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [isInfoUpdated, setIsInfoUpdated] = useState(false);

  const didInitRef = useRef(false);
  const didSetAddressTextRef = useRef(false);
  const scrollRef = useRef(null);
  const addressYRef = useRef(0);
  const placesRef = useRef(null);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  const {
    setUserToDB,
    userToDB,
    user,
    handleUpdate,
    setUser,
    isLoading,
    buildShipToFromGooglePlace,
    finalizePendingEmailChange,
  } = useContext(AuthenticationContext);

  console.log(
    "userToDB at Personal Info View:",
    JSON.stringify(userToDB, null, 2)
  );

  const { deviceLat, deviceLng } = useContext(GeolocationContext);
  console.log("Device location at Personal Info View:", {
    deviceLat,
    deviceLng,
  });

  const {
    snackbar,
    hideSnackbar,
    showSuccessSnackbar,
    showErrorSnackbar,
    isValidEmail,
  } = useContext(GlobalContext);

  useFocusEffect(
    useCallback(() => {
      if (didInitRef.current) return;
      didInitRef.current = true;

      setUserToDB((prev) => ({
        ...prev,
        first_name: user?.first_name ?? prev?.first_name ?? "",
        last_name: user?.last_name ?? prev?.last_name ?? "",
        email: user?.email ?? prev?.email ?? "",
        phone_number: user?.phone_number ?? prev?.phone_number ?? "",
        address: user?.address ?? prev?.address ?? "",
        display_name:
          user?.display_name ?? user?.first_name ?? prev?.display_name ?? "",
        createdAt:
          user?.createdAt ?? prev?.createdAt ?? new Date().toISOString(),
        ship_to: user?.ship_to ?? prev?.ship_to ?? null,
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

  // ************** UPDATE CTA VISIBILITY ***************
  const normalize = (v = "") => String(v ?? "").trim();

  const hasChanges = useMemo(() => {
    return (
      normalize(userToDB?.first_name) !== normalize(user?.first_name) ||
      normalize(userToDB?.last_name) !== normalize(user?.last_name) ||
      normalize(userToDB?.email).toLowerCase() !==
        normalize(user?.email).toLowerCase() ||
      normalize(userToDB?.phone_number) !== normalize(user?.phone_number) ||
      normalize(userToDB?.address) !== normalize(user?.address)
    );
  }, [userToDB, user]);

  //   ************** PHONE VALIDATION LOGIC ***************
  const onlyDigits = (s = "") => String(s).replace(/\D/g, "");

  const formatPhone = (input = "") => {
    const digits = onlyDigits(input).slice(0, 10);

    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)})${digits.slice(3)}`;
    return `(${digits.slice(0, 3)})${digits.slice(3, 6)}.${digits.slice(6)}`;
  };

  const handleAddressPress = (data, details = null) => {
    const formatted = details?.formatted_address ?? data.description;

    const ship_to = buildShipToFromGooglePlace({
      details: details,
      user: {
        name: `${userToDB.first_name} ${userToDB.last_name}`,
        phone: userToDB.phone_number,
      },
    });

    setUserToDB((prev) => ({
      ...prev,
      address: formatted,
      ship_to,
    }));
    setSelectedAddress({
      formatted_address: formatted,
      lat: details?.geometry?.location?.lat,
      lng: details?.geometry?.location?.lng,
      place_id: details?.place_id ?? data?.place_id,
    });
  };

  const scrollToAddress = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        // y: Math.max(addressYRef.current - 80, 0),
        y: addressYRef.current + 300,
        animated: true,
      });
    }, 250);
  };

  const isEmpty = (value) => !String(value ?? "").trim();

  const validatePersonalInfo = () => {
    if (isEmpty(userToDB?.first_name)) {
      showErrorSnackbar(
        t("menu.personal_info_view.first_name_required"),
        () => {
          hideSnackbar();
          firstNameRef.current?.focus();
        }
      );

      firstNameRef.current?.focus();
      return false;
    }

    if (isEmpty(userToDB?.last_name)) {
      showErrorSnackbar(t("menu.personal_info_view.last_name_required"), () => {
        setIsInfoUpdated(false);
        hideSnackbar();
        lastNameRef.current?.focus();
      });

      lastNameRef.current?.focus();
      return false;
    }

    if (isEmpty(userToDB?.email)) {
      showErrorSnackbar(t("menu.personal_info_view.email_required"), () => {
        setIsInfoUpdated(false);
        hideSnackbar();
        emailRef.current?.focus();
      });

      emailRef.current?.focus();
      return false;
    }

    if (isEmpty(userToDB?.phone_number)) {
      showErrorSnackbar(t("menu.personal_info_view.phone_required"), () => {
        setIsInfoUpdated(false);
        hideSnackbar();
        phoneRef.current?.focus();
      });

      phoneRef.current?.focus();
      return false;
    }

    if (isEmpty(userToDB?.address)) {
      showErrorSnackbar(t("menu.personal_info_view.address_required"), () => {
        setIsInfoUpdated(false);
        hideSnackbar();
        scrollToAddress();
      });

      scrollToAddress();
      return false;
    }

    return true;
  };
  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      {isLoading && (
        <Global_activity_indicator
          caption={t("menu.personal_info_view.activity_indicator")}
          caption_width="65%"
        />
      )}
      {!isLoading && (
        <>
          <Go_Back_Header label="" action={() => navigation.goBack()} />
          <Container
            width="100%"
            height="10%"
            //color={theme.colors.bg.elements_bg}
            color={"yellow"}
            align="flex-start"
            direction="row"
          >
            <Container
              width="50%"
              height="100%"
              justify="center"
              align="center"
              color={theme.colors.bg.elements_bg}
              //color={"green"}
            >
              <Spacer position="left" size="large">
                <Text variant="raleway_bold_18" textAlign="center">
                  {t("menu.personal_info_view.title")}
                </Text>
              </Spacer>
            </Container>
            <Container
              width="50%"
              height="100%"
              justify="center"
              align="center"
              color={theme.colors.bg.elements_bg}
            >
              {hasChanges && !snackbar.visible && (
                <Regular_CTA
                  width="130px"
                  height={"45px"}
                  color={theme.colors.ui.primary}
                  border_radius={"40px"}
                  caption={t("menu.personal_info_view.cta")}
                  caption_text_variant="dm_sans_bold_16_white"
                  action={async () => {
                    if (!validatePersonalInfo()) return;

                    if (!isValidEmail(userToDB?.email)) {
                      showErrorSnackbar(
                        t("login_screen.email_login_error"),
                        () => {
                          hideSnackbar();
                          emailRef.current?.focus();
                        }
                      );

                      setTimeout(() => {
                        emailRef.current?.focus();
                      }, 100);

                      return;
                    }

                    const payload = {
                      ...userToDB,
                    };
                    console.log(
                      "Payload for update at action:",
                      JSON.stringify(payload, null, 2)
                    );

                    // very important
                    if (!payload.ship_to) {
                      delete payload.ship_to;
                    }
                    const res = await handleUpdate(payload);

                    if (!res?.ok) {
                      if (res.error === "requires_recent_login") {
                        showErrorSnackbar(
                          t("menu.personal_info_view.snack_bar_auth_error"),
                          () => {
                            hideSnackbar();
                            navigation.navigate("Shop_Login_Users_View");
                          }
                        );
                        return;
                      }
                      if (res.error === "email_already_in_use") {
                        showErrorSnackbar(
                          t("menu.personal_info_view.snack_bar_email_used"),
                          () => {
                            hideSnackbar();
                            navigation.navigate("Shop_Login_Users_View");
                          }
                        );
                        return;
                      }
                      return;
                    }

                    if (res.emailChanged) {
                      navigation.navigate("Email_Verification_Sent_View", {
                        pendingEmail: res.pendingEmail,
                      });
                      return;
                    }

                    // setVisible(true);
                    setIsInfoUpdated(true);
                    showSuccessSnackbar(
                      t("menu.personal_info_view.snack_bar_updated"),
                      () => {
                        hideSnackbar();
                        navigation.goBack();
                      }
                    );
                  }}
                />
              )}
            </Container>
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
                ref={firstNameRef}
                label={t("menu.personal_info_view.name_input_placeholder")}
                value={userToDB?.first_name ?? ""}
                fontFamily="DMSans-Bold"
                onChangeText={(value) => {
                  hideSnackbar();
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
                autoCorrect={false}
                autoComplete="off"
                textContentType="none"
                autoCapitalize="none"
                importantForAutofill="no"
                spellCheck={false}
              />
              <DataInput
                ref={lastNameRef}
                label={t("menu.personal_info_view.last_name_input_placeholder")}
                fontFamily="DMSans-Bold"
                value={userToDB?.last_name ?? ""}
                onChangeText={(value) => {
                  hideSnackbar();
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
                onFocus={() => setIsLastNameFocused(true)}
                onBlur={() => setIsLastNameFocused(false)}
                blurOnSubmit
                autoCorrect={false}
                autoComplete="off"
                textContentType="none"
                autoCapitalize="none"
                importantForAutofill="no"
                spellCheck={false}
              />
              <DataInput
                ref={emailRef}
                label={t("menu.personal_info_view.email_input_placeholder")}
                fontFamily="DMSans-Bold"
                value={userToDB?.email ?? ""}
                onChangeText={(value) => {
                  hideSnackbar();
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
                onBlur={() => null}
              />
              <DataInput
                ref={phoneRef}
                label={t("menu.personal_info_view.phone_input_placeholder")}
                fontFamily="DMSans-Bold"
                value={userToDB?.phone_number ?? ""}
                onChangeText={(value) => {
                  hideSnackbar();
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
                onFocus={() => null}
                onBlur={() => null}
                blurOnSubmit
              />
              <Spacer position="top" size="extraLarge" />
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
                  onLayout={(event) => {
                    addressYRef.current = event.nativeEvent.layout.y;
                  }}
                >
                  <GooglePlacesAutocomplete
                    ref={placesRef}
                    placeholder={t(
                      "menu.personal_info_view.address_input_placeholder"
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
                      value: userToDB?.address ?? "",
                      onFocus: scrollToAddress,
                      fontFamily: "DMSans-Bold",
                      onChangeText: (text) => {
                        hideSnackbar();
                        scrollToAddress();

                        setUserToDB((prev) => ({
                          ...prev,
                          address: text,
                          ship_to: prev?.ship_to ?? user?.ship_to ?? null,
                        }));

                        setSelectedAddress(null);
                      },
                    }}
                    onPress={(data, details = null) => {
                      Keyboard.dismiss();
                      handleAddressPress(data, details);
                    }}
                  />
                </View>
              </Container>
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}
      <Snack_Bar_Component
        snackbar={snackbar}
        bottom_ios={isInfoUpdated ? 60 : 270}
        bottom_android={isInfoUpdated ? 60 : 310}
      />
    </SafeArea>
  );
}
