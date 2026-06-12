import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text as RNText,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Checkbox } from "react-native-paper";
import { Snackbar } from "react-native-paper";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Container,
  Action_Container,
} from "../../components/containers/general.containers";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";
import { DataInput } from "../../components/inputs/data_text_input.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
import { Time_Picker_Component } from "../../components/others/time_picker.component.js";
// import RightArrowIcon from "../../../assets/my_icons/chevron-right.svg";
import { RightArrowIcon } from "../../../assets/modified_icons/right_arrow_icon.js";
import { Detail_Navigation_Tile } from "../../components/tiles/detail_navigation.tile.js";

// import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context.js";
import { GeolocationContext } from "../../infrastructure/services/geolocation/geolocation.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";
import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context.js";

export default function Warehouse_Details_View() {
  // 1. Navigation / theme / route
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const tabBarHeight = useBottomTabBarHeight();

  const { coming_from } = route?.params ?? {};

  // 2. Contexts
  const {
    warehouseSelected,
    setWarehouseSelected,
    updateWarehouse,
    createWarehouse,
    isLoading,
    validateWarehouse,
    buildShipFromFromGooglePlace,
    WAREHOUSE_INITIAL_STATE,
  } = useContext(WarehouseContext);

  const { deviceLat, deviceLng } = useContext(GeolocationContext);

  const {
    formatPhone,
    statusSnackbarVisible,
    setStatusSnackbarVisible,
    statusSnackbarMessage,
    showStatusSnackbar,
  } = useContext(GlobalContext);

  // 3. Mode flags
  const isCreateMode = coming_from === "add_cta";
  const isEditMode = coming_from === "warehouse_tile";

  const selectedWarehouse = warehouseSelected || WAREHOUSE_INITIAL_STATE;

  // 4. Refs
  const originalWarehouseRef = useRef(null);
  const warehouseNameInputRef = useRef(null);
  const addressDataInputRef = useRef(null);
  const phoneDataInputRef = useRef(null);
  const emailDataInputRef = useRef(null);

  // 5. Local state
  const [addressText, setAddressText] = useState("");
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSnackbarLocked, setIsSnackbarLocked] = useState(false);
  const [isScreenLocked, setIsScreenLocked] = useState(false);

  // 6. Derived values

  const warehouseFormattedAddress = useMemo(
    () =>
      selectedWarehouse?.geo?.formatted_address ||
      selectedWarehouse?.physical_address ||
      "",
    [selectedWarehouse]
  );

  const placesQuery = useMemo(
    () => ({
      key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY,
      language: "en",
      components: "country:us",
      types: "geocode",
      ...(typeof deviceLat === "number" && typeof deviceLng === "number"
        ? { location: `${deviceLat},${deviceLng}`, radius: 50000 }
        : {}),
    }),
    [deviceLat, deviceLng]
  );

  // 7. Effects

  useEffect(() => {
    if (!isEditMode) return;
    if (!selectedWarehouse?.warehouse_id) return;
    if (originalWarehouseRef.current) return;

    originalWarehouseRef.current = JSON.parse(
      JSON.stringify(selectedWarehouse)
    );
  }, [isEditMode, selectedWarehouse?.warehouse_id]);

  useEffect(() => {
    const isNewWarehouse = isCreateMode && !selectedWarehouse?.warehouse_id;

    if (!isNewWarehouse) {
      Keyboard.dismiss();
      return;
    }

    const timer = setTimeout(() => {
      warehouseNameInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, [isCreateMode, selectedWarehouse?.warehouse_id]);

  useEffect(() => {
    setAddressText(warehouseFormattedAddress || "");

    addressDataInputRef.current?.setAddressText?.(
      warehouseFormattedAddress || ""
    );
  }, [warehouseFormattedAddress]);

  // 8. Memoized computed state

  const hasChanges = useMemo(() => {
    if (isCreateMode) return true;

    const original = originalWarehouseRef.current;
    const current = selectedWarehouse;

    if (!original || !current) return false;

    return JSON.stringify(original) !== JSON.stringify(current);
  }, [isCreateMode, selectedWarehouse]);

  const shouldShowCTA = isCreateMode || hasChanges;

  // 9. Handlers

  const handleGoBack = () => {
    setWarehouseSelected(WAREHOUSE_INITIAL_STATE);
    navigation.goBack();
  };

  const lockScreenAfterSuccess = (message) => {
    setIsUnlocked(true);
    setIsSnackbarLocked(true);
    setIsScreenLocked(true);
    showStatusSnackbar(message);
  };

  const handleSubmitWarehouse = async () => {
    Keyboard.dismiss();

    const validationError = validateWarehouse();
    setError(validationError);

    if (validationError) {
      showStatusSnackbar(validationError);
      return;
    }

    if (isEditMode) {
      const { success, warehouse, error } = await updateWarehouse(
        selectedWarehouse
      );

      console.log(
        "UPDATE WAREHOUSE RESULT:",
        JSON.stringify(warehouse, null, 2)
      );

      if (success) {
        lockScreenAfterSuccess("Warehouse updated successfully!");
      } else {
        setError(error || "Failed to update warehouse");
        showStatusSnackbar(error || "Failed to update warehouse");
      }

      return;
    }

    if (isCreateMode) {
      const { success, warehouse, error } = await createWarehouse(
        selectedWarehouse
      );

      console.log(
        "CREATE WAREHOUSE RESULT:",
        JSON.stringify(warehouse, null, 2)
      );

      if (success) {
        lockScreenAfterSuccess("Warehouse created successfully!");
      } else {
        setError(error || "Failed to create warehouse");
        showStatusSnackbar(error || "Failed to create warehouse");
      }
    }
  };

  const handleAddressPress = (data, details = null) => {
    if (isScreenLocked) return;

    const formatted = details?.formatted_address ?? data.description;
    const lat = details?.geometry?.location?.lat;
    const lng = details?.geometry?.location?.lng;

    if (!formatted || typeof lat !== "number" || typeof lng !== "number") {
      setScrollEnabled(true);
      return;
    }

    setAddressText(formatted);

    const ship_from = buildShipFromFromGooglePlace({
      details,
      warehouse: selectedWarehouse,
    });

    setWarehouseSelected((prev) => ({
      ...prev,
      physical_address: formatted,
      geo: {
        formatted_address: formatted,
        lat,
        lng,
        place_id: details?.place_id ?? data?.place_id,
        address_components: details?.address_components || [],
      },
      ship_from,
    }));

    setScrollEnabled(true);
  };

  const handleClearAddress = () => {
    setAddressText("");
    addressDataInputRef.current?.setAddressText?.("");

    requestAnimationFrame(() => {
      addressDataInputRef.current?.focus?.();
    });
  };

  const handleToggleShippingFlatRate = () => {
    setWarehouseSelected((prev) => ({
      ...prev,
      shipping_information: {
        ...(prev?.shipping_information || {}),
        is_shipping_flat_rate_active:
          !prev?.shipping_information?.is_shipping_flat_rate_active,
      },
    }));
  };

  const handleToggleWarehouseActive = () => {
    setWarehouseSelected((prev) => ({
      ...prev,
      active: !prev?.active,
    }));
  };

  const handleSnackbarClose = () => {
    if (isUnlocked) {
      setIsUnlocked(false);
      setIsSnackbarLocked(false);
      setIsScreenLocked(false);
      setStatusSnackbarVisible(false);
      navigation.popToTop();
      return;
    }

    if (error) {
      setStatusSnackbarVisible(false);
    }
  };

  const representativeCompleted =
    !!selectedWarehouse?.warehouse_information?.representative.name &&
    !!selectedWarehouse?.warehouse_information?.representative.email &&
    !!selectedWarehouse?.warehouse_information?.representative.phone_number;

  const inventoryValues = Object.values(selectedWarehouse?.inventory || {});
  const productsConfigured = inventoryValues.some((qty) => Number(qty) > 0);

  console.log("REP INFO:", selectedWarehouse?.warehouse_information);
  console.log("REP COMPLETED:", representativeCompleted);
  console.log("PRODUCTS CONFIGURED:", productsConfigured);

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {isLoading ? (
          <Global_activity_indicator
            caption={
              isCreateMode
                ? "Wait, Creating warehouse..."
                : "Wait, Updating warehouse..."
            }
            caption_width="70%"
          />
        ) : (
          <Container
            width="100%"
            height="100%"
            color={theme.colors.bg.elements_bg}
            justify="flex-start"
            align="center"
            // style={{
            //   paddingBottom: tabBarHeight,
            // }}
          >
            <Go_Back_Header label="" action={handleGoBack} />

            <Container
              width="100%"
              color={theme.colors.bg.elements_bg}
              align="center"
              justify="flex-end"
              direction="row"
              style={{ marginRight: 20, marginTop: 10 }}
            >
              {shouldShowCTA && !isScreenLocked ? (
                <Regular_CTA
                  width="30%"
                  height={40}
                  color={theme.colors.ui.primary}
                  border_radius={"40px"}
                  caption={coming_from === "add_cta" ? "Create" : "Update"}
                  caption_text_variant="dm_sans_bold_16_white"
                  action={handleSubmitWarehouse}
                />
              ) : (
                // 👇 keeps layout stable when CTA is hidden
                <Container width="30%" />
              )}
            </Container>

            <ScrollView
              style={{ flex: 1, width: "100%" }}
              contentContainerStyle={{
                // paddingBottom: 40,
                paddingBottom: tabBarHeight,
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
                  value={selectedWarehouse.warehouse_name}
                  onChangeText={(value) => {
                    setWarehouseSelected((prev) => ({
                      ...prev,
                      warehouse_name: value,
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
                <DataInput
                  ref={phoneDataInputRef}
                  label="Phone number"
                  // value={warehouseSelected.warehouse_information.phone}
                  value={selectedWarehouse.warehouse_information.phone}
                  onChangeText={(value) => {
                    const formatted = formatPhone(value);

                    setWarehouseSelected((prev) => ({
                      ...prev,
                      warehouse_information: {
                        ...prev.warehouse_information,
                        phone: formatted,
                      },
                    }));
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
                      onPress={handleAddressPress}
                      textInputProps={{
                        value: addressText,
                        autoCorrect: false,
                        autoCapitalize: "none",
                        editable: !isScreenLocked,
                        onFocus: () => {
                          if (!isScreenLocked) setScrollEnabled(false);
                        },
                        onBlur: () => setScrollEnabled(true),
                        onChangeText: (t) => {
                          if (isScreenLocked) return;
                          setAddressText(t);
                        },
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
                        editable: !isScreenLocked,
                        onFocus: () => {
                          if (!isScreenLocked) {
                            setScrollEnabled(false);
                          }
                        },
                        onBlur: () => setScrollEnabled(true),

                        onChangeText: (t) => {
                          if (isScreenLocked) return;

                          setAddressText(t);
                        },
                      }}
                      onPress={handleAddressPress}
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
                    {addressText.length > 0 && (
                      <TouchableOpacity
                        onPress={handleClearAddress}
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
                  // value={warehouseSelected.warehouse_information.email}
                  value={selectedWarehouse.warehouse_information.email}
                  onChangeText={(value) => {
                    setWarehouseSelected((prev) => ({
                      ...prev,
                      warehouse_information: {
                        ...prev.warehouse_information,
                        email: value,
                      },
                    }));
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
                {/* {showOpenPicker && ( */}
                <Time_Picker_Component
                  type="opening_time"
                  coming_from={coming_from}
                />
                <Spacer position="top" size="medium" />
                <Time_Picker_Component
                  type="closing_time"
                  coming_from={coming_from}
                />
                <Spacer position="top" size="medium" />
                {/* **************** Shipping flat rate activation tile  ***************************************** */}
                <Action_Container
                  width="95%"
                  // height="15%"
                  padding_vertical="25px"
                  color={theme.colors.bg.screens_bg}
                  // color={"lightgreen"}
                  justify="center"
                  align="flex-start"
                  direction="row"
                  onPress={handleToggleShippingFlatRate}
                >
                  <Container
                    width="50%"
                    style={{ alignSelf: "stretch" }}
                    color={theme.colors.bg.screens_bg}
                    //color={"lightblue"}
                    justify="center"
                    align="flex-start"
                  >
                    <Spacer position="left" size="large">
                      <Text variant="raleway_bold_18">Shipping Flat rate</Text>
                    </Spacer>
                    <Spacer position="left" size="large">
                      <Text
                        variant="raleway_bold_14_grey"
                        style={{ color: "#6F7285" }}
                      >
                        (Tap to activate ship flat rate)
                      </Text>
                    </Spacer>
                  </Container>
                  <Container
                    width="15%"
                    style={{ alignSelf: "stretch" }}
                    color={theme.colors.bg.screens_bg}
                    //color={"lightgreen"}
                    justify="center"
                    align="center"
                  >
                    <Checkbox
                      color={theme.colors.ui.primary}
                      uncheckedColor="#A5A5A5"
                      status={
                        selectedWarehouse?.shipping_information
                          ?.is_shipping_flat_rate_active
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={handleToggleShippingFlatRate}
                    />
                  </Container>
                  <Container
                    width="35%"
                    style={{
                      alignSelf: "stretch",
                      overflow: "visible", // Ensure no clipping occurs
                    }}
                    color={theme.colors.bg.screens_bg}
                    justify="center"
                    align="flex-end"
                  >
                    {selectedWarehouse?.shipping_information
                      ?.is_shipping_flat_rate_active && (
                      <DataInput
                        value={String(
                          selectedWarehouse?.shipping_information
                            ?.shipping_flat_rate ?? ""
                        )}
                        onChangeText={(value) => {
                          const numericValue =
                            parseFloat(value.replace(/[^0-9]/g, "")) || 0;
                          setWarehouseSelected((prev) => ({
                            ...prev,
                            shipping_information: {
                              ...(prev?.shipping_information || {}),
                              shipping_flat_rate: numericValue,
                            },
                          }));
                        }}
                        keyboardType="numeric"
                        label=""
                        border_color={theme.colors.inputs.bottom_lines_disabled}
                        underlineColor={
                          theme.colors.inputs.bottom_lines_disabled
                        }
                        activeUnderlineColor={theme.colors.ui.primary}
                        style={{
                          backgroundColor: "#D5D5D8",
                          // borderRadius: 20, // Ensure border radius is applied
                          height: 45,
                          overflow: "visible", // Prevent clipping
                        }}
                        contentStyle={{
                          fontFamily: "ralewayBold",
                          fontSize: 16,
                        }}
                      />
                    )}
                  </Container>
                </Action_Container>
                <Spacer position="top" size="medium" />
                {/* ***************************************************************************** */}
                {/* **************** Customer's Max Pickup distance limit tile  ***************************************** */}
                <Action_Container
                  width="95%"
                  // height="15%"
                  padding_vertical="25px"
                  color={theme.colors.bg.screens_bg}
                  // color={"lightgreen"}
                  justify="center"
                  align="flex-start"
                  direction="row"
                  onPress={handleToggleShippingFlatRate}
                >
                  <Container
                    width="50%"
                    style={{ alignSelf: "stretch" }}
                    color={theme.colors.bg.screens_bg}
                    //color={"lightblue"}
                    justify="center"
                    align="flex-start"
                  >
                    <Spacer position="left" size="large">
                      <Text variant="raleway_bold_18">
                        Max pickup distance limit
                      </Text>
                    </Spacer>
                  </Container>
                  <Container
                    width="15%"
                    style={{ alignSelf: "stretch" }}
                    color={theme.colors.bg.screens_bg}
                    //color={"lightgreen"}
                    justify="center"
                    align="center"
                  />
                  <Container
                    width="35%"
                    style={{
                      alignSelf: "stretch",
                      overflow: "visible", // Ensure no clipping occurs
                    }}
                    color={theme.colors.bg.screens_bg}
                    justify="center"
                    align="flex-end"
                  >
                    <DataInput
                      value={String(
                        selectedWarehouse?.max_limit_pickup_ratio ?? ""
                      )}
                      onChangeText={(value) => {
                        const numericValue =
                          parseFloat(value.replace(/[^0-9]/g, "")) || 0;

                        setWarehouseSelected((prev) => ({
                          ...prev,
                          max_limit_pickup_ratio: numericValue,
                        }));
                      }}
                      keyboardType="numeric"
                      label=""
                      border_color={theme.colors.inputs.bottom_lines_disabled}
                      underlineColor={theme.colors.inputs.bottom_lines_disabled}
                      activeUnderlineColor={theme.colors.ui.primary}
                      style={{
                        backgroundColor: "#D5D5D8",
                        // borderRadius: 20, // Ensure border radius is applied
                        height: 45,
                        overflow: "visible", // Prevent clipping
                      }}
                      contentStyle={{
                        fontFamily: "ralewayBold",
                        fontSize: 16,
                      }}
                    />
                  </Container>
                </Action_Container>
                <Spacer position="top" size="medium" />
                {/* ***************************************************************************** */}
                <Detail_Navigation_Tile
                  action={handleToggleWarehouseActive}
                  main_caption={
                    selectedWarehouse?.active
                      ? "Warehouse: active"
                      : "Warehouse: inactive"
                  }
                  sub_caption="(Tap to change status)"
                  icon={
                    <MaterialCommunityIcons
                      name={
                        selectedWarehouse?.active
                          ? "check-circle"
                          : "checkbox-blank-circle-outline"
                      }
                      size={24}
                      color={
                        selectedWarehouse?.active
                          ? theme.colors.ui.primary
                          : theme.colors.ui.error
                      }
                    />
                  }
                  highlighted={selectedWarehouse?.active}
                />
                <Spacer position="top" size="medium" />
                <Detail_Navigation_Tile
                  action={() =>
                    navigation.navigate("Warehouse_Representative_View")
                  }
                  main_caption="Warehouse Representative"
                  sub_caption="Tap to see info..."
                  icon={
                    <MaterialCommunityIcons
                      name={
                        representativeCompleted
                          ? "check-circle"
                          : "checkbox-blank-circle-outline"
                      }
                      size={24}
                      color={
                        representativeCompleted
                          ? theme.colors.ui.primary
                          : theme.colors.ui.error
                      }
                    />
                  }
                  highlighted={representativeCompleted}
                />

                {/* ***************************************************************************** */}
                <Spacer position="top" size="medium" />
                <Detail_Navigation_Tile
                  action={() =>
                    navigation.navigate("Products_By_grindType_View", {
                      coming_from,
                    })
                  }
                  main_caption="Warehouse Products"
                  sub_caption="(Tap to see inventory...)"
                  icon={
                    <MaterialCommunityIcons
                      name={
                        productsConfigured
                          ? "check-circle"
                          : "checkbox-blank-circle-outline"
                      }
                      size={24}
                      color={
                        productsConfigured
                          ? theme.colors.ui.primary
                          : theme.colors.ui.error
                      }
                    />
                  }
                  highlighted={productsConfigured}
                  last_one={true}
                />

                {/* ***************************************************************************** */}
                <Spacer position="top" size="medium" />
              </Container>
              {isScreenLocked && (
                <View
                  pointerEvents="auto"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10,
                    backgroundColor: "transparent",
                  }}
                />
              )}
            </ScrollView>
          </Container>
        )}
      </KeyboardAvoidingView>

      <Snackbar
        visible={statusSnackbarVisible}
        // onDismiss={() => setStatusSnackbarVisible(false)}
        onDismiss={() => {
          if (!isSnackbarLocked) {
            setStatusSnackbarVisible(false);
          }
        }}
        duration={Number.POSITIVE_INFINITY}
        action={{
          label: "Close",
          onPress: handleSnackbarClose,
        }}
        style={{
          minHeight: 80,
          marginHorizontal: 10,
          marginBottom: 50,
          backgroundColor: error ? "red" : theme.colors.ui.primary,
          zIndex: 20,
          elevation: 20,
        }}
      >
        {statusSnackbarMessage}
      </Snackbar>
    </SafeArea>
  );
}
