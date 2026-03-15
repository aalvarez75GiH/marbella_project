import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import {
  Alert,
  ActivityIndicator,
  Platform,
  View,
  Linking,
  AppState,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Snackbar } from "react-native-paper";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { theme } from "../../infrastructure/theme";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { GlobalContext } from "../../infrastructure/services/global/global.context";

export default function Merchant_Pickup_Scanner_View() {
  const [permission, requestPermission, getPermission] = useCameraPermissions();
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [lastScannedToken, setLastScannedToken] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const scanLockRef = useRef(false);
  const navigation = useNavigation();

  const { getOrderByQRToken } = useContext(OrdersContext);
  const { snackbar, showSnackbar, hideSnackbar } = useContext(GlobalContext);

  useEffect(() => {
    if (!permission) return;

    if (!permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useFocusEffect(
    useCallback(() => {
      refreshCameraPermission();
    }, [])
  );
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        refreshCameraPermission();
      }
    });

    return () => sub.remove();
  }, []);

  const resetScannerSoon = () => {
    setTimeout(() => {
      scanLockRef.current = false;
      setIsScanningEnabled(true);
    }, 1500);
  };

  const validatePickup = async (token) => {
    setIsValidating(true);

    setTimeout(async () => {
      try {
        const res = await getOrderByQRToken(token);
        console.log("Order validation response:", JSON.stringify(res, null, 2));

        if (res.status === 409) {
          setValidationError(
            res.message ||
              "Order has already been picked up. Try another QR code."
          );
          return;
        }
        if (res.order_id) {
          navigation.navigate("Order_View", { order: res });
          setLastScannedToken(token);
        }
      } catch (error) {
        const status = error?.response?.status;
        const data = error?.response?.data;

        if (status === 409 && data?.code === "ORDER_ALREADY_PICKED_UP") {
          setValidationError(
            data?.used_at
              ? `This order was already collected at ${data.used_at}`
              : "This order has already been picked up."
          );
          return;
        }

        Alert.alert(
          "Scanner error",
          data?.message || error?.message || "Something went wrong."
        );
      } finally {
        setIsValidating(false);
        resetScannerSoon();
      }
    }, 3000);
  };

  const handleBarCodeScanned = ({ data }) => {
    if (!data) return;

    if (scanLockRef.current || isValidating || !isScanningEnabled) {
      return;
    }

    console.log("Barcode scanned with data:", data);

    if (!data.startsWith("marbella://pickup/")) {
      scanLockRef.current = true;
      setIsScanningEnabled(false);

      Alert.alert("Invalid QR", "This code is not a Marbella pickup QR.");
      resetScannerSoon();
      return;
    }

    const token = data.replace("marbella://pickup/", "").trim();
    console.log("Extracted pickup token:", token);

    if (!token) {
      scanLockRef.current = true;
      setIsScanningEnabled(false);

      Alert.alert("Invalid QR", "Pickup token not found.");
      resetScannerSoon();
      return;
    }

    scanLockRef.current = true;
    setIsScanningEnabled(false);

    validatePickup(token);
  };

  const refreshCameraPermission = async () => {
    try {
      const latest = await getPermission();
      console.log("LATEST CAMERA PERMISSION:", latest);
    } catch (error) {
      console.log("REFRESH CAMERA PERMISSION ERROR:", error);
    }
  };

  const handleRequestCameraPermission = async () => {
    try {
      if (!permission?.canAskAgain && !permission?.granted) {
        Alert.alert(
          "Camera access blocked",
          "Please enable camera access in Settings to scan pickup QR codes.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }

      const result = await requestPermission();
      console.log("CAMERA PERMISSION RESULT:", result);

      if (!result.granted && !result.canAskAgain) {
        Alert.alert(
          "Camera access blocked",
          "Please enable camera access in Settings to scan pickup QR codes.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
    } catch (error) {
      console.log("CAMERA PERMISSION ERROR:", error);
      Alert.alert("Permission error", "Could not request camera permission.");
    }
  };

  console.log("CAMERA PERMISSION STATE:", permission);
  if (!permission) {
    return (
      <Container
        width="100%"
        style={{ flex: 1 }}
        color={theme.colors.bg.primary}
      >
        <SafeArea>
          <Exit_Header_With_Label
            label="Scan order"
            action={() => navigation.goBack()}
          />

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 24,
            }}
          >
            <ActivityIndicator size="large" color={theme.colors.ui.primary} />
            <Spacer position="top" size="medium" />
            <Text variant="dm_sans_bold_16">Loading camera...</Text>
          </View>
        </SafeArea>
      </Container>
    );
  }

  if (!permission.granted) {
    return (
      <SafeArea>
        <Exit_Header_With_Label
          label="Scan order"
          action={() => navigation.goBack()}
        />

        <Container
          width="100%"
          height="100%"
          justify="center"
          align="center"
          style={{
            flex: 1,
            //   justifyContent: "center",
            //   alignItems: "center",
            paddingHorizontal: 24,
          }}
          color={theme.colors.bg.elements_bg}
        >
          <Container
            width="100%"
            height="10%"
            justify="center"
            align="center"
            color={theme.colors.bg.elements_bg}
          >
            <Text variant="dm_sans_bold_20">Camera access needed</Text>
            <Spacer position="top" size="medium" />
            <Text variant="dm_sans_bold_16">
              Merchant scanner needs camera permission
            </Text>
            <Text variant="dm_sans_bold_16">to scan pickup QR codes.</Text>
          </Container>
          <Spacer position="top" size="large" />
          <Spacer position="top" size="large" />
          <Spacer position="top" size="large" />
          <Regular_CTA
            width="70%"
            height={Platform.OS === "ios" ? "7%" : "8%"}
            color={theme.colors.ui.primary}
            border_radius="40px"
            caption="Allow Camera"
            caption_text_variant="dm_sans_bold_18_white"
            action={handleRequestCameraPermission}
          />
        </Container>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <Exit_Header_With_Label
        label="Scan order"
        action={() => navigation.goBack()}
      />
      {isValidating && (
        <Container
          width="100%"
          //   height="100%"
          style={{ flex: 1 }}
          justify="center"
          align="center"
          color="red"
        >
          <Global_activity_indicator
            caption="Wait, we getting customers order details..."
            caption_width="65%"
          />
        </Container>
      )}

      {!isValidating && (
        <View style={{ flex: 1 }}>
          <Spacer position="top" size="medium" />

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 24,
            }}
          >
            <Text variant="dm_sans_bold_22">Scan Pickup QR</Text>
            <Spacer position="top" size="small" />
            <Text variant="dm_sans_bold_16" textAlign="center">
              Point the camera at the customer pickup QR code.
            </Text>
          </View>

          <Spacer position="top" size="large" />

          <View
            style={{
              width: "100%",
              height: "65%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "88%",
                height: "100%",
                borderRadius: 24,
                overflow: "hidden",
                backgroundColor: "black",
                position: "relative",
              }}
            >
              <CameraView
                style={{ width: "100%", height: "100%" }}
                facing="back"
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
                // onBarcodeScanned={handleBarCodeScanned}
                onBarcodeScanned={
                  isScanningEnabled && !isValidating
                    ? handleBarCodeScanned
                    : undefined
                }
              />

              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "68%",
                    height: "42%",
                    borderWidth: 2,
                    borderColor: "#FFFFFF",
                    borderRadius: 20,
                    backgroundColor: "transparent",
                  }}
                />
              </View>
            </View>
          </View>
          <Snackbar
            visible={!!validationError}
            onDismiss={() => {
              setValidationError(null);
              scanLockRef.current = false;
              setIsScanningEnabled(true);
            }}
            duration={Number.POSITIVE_INFINITY}
            action={{
              label: "Close",
              onPress: () => {
                setValidationError(null);
                setLastScannedToken(null);
                scanLockRef.current = false;
                setIsScanningEnabled(true);
              },
            }}
            style={{
              minHeight: 80,
              margin: 16,
              backgroundColor: "#B00020",
            }}
          >
            {validationError}
          </Snackbar>

          <Spacer position="top" size="large" />
        </View>
      )}
    </SafeArea>
  );
}
