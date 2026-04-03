import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { Snackbar } from "react-native-paper";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { Container } from "../../components/containers/general.containers.js";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component.js";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component.js";
import { Text } from "../../infrastructure/typography/text.component.js";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component.js";
import { Regular_CTA } from "../../components/ctas/regular.cta.js";
import { Inventory_Accordion } from "../../components/others/inventory_accordion.component.js";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context.js";
import { GlobalContext } from "../../infrastructure/services/global/global.context.js";

export default function Warehouse_Inventory_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const tabBarHeight = useBottomTabBarHeight();

  const {
    warehouseSelected,
    productsCatalog,
    buildInventoryProducts,
    updateWarehouseInventory,
    isLoading,
  } = useContext(WarehouseContext);

  const { inventory } = warehouseSelected || {};

  const {
    statusSnackbarVisible,
    setStatusSnackbarVisible,
    statusSnackbarMessage,
    showStatusSnackbar,
  } = useContext(GlobalContext);

  console.log("WAREHOUSE ID FROM CONTEXT: ", warehouseSelected.warehouse_id);

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [editableInventory, setEditableInventory] = useState(inventory || {});

  const originalInventory = useRef(inventory || {});

  const hasChanges = useMemo(() => {
    const original = originalInventory.current || {};
    const current = editableInventory || {};

    const allKeys = new Set([
      ...Object.keys(original),
      ...Object.keys(current),
    ]);

    for (let key of allKeys) {
      if (Number(original[key] || 0) !== Number(current[key] || 0)) {
        return true;
      }
    }

    return false;
  }, [editableInventory]);

  const groundProductsForUI = useMemo(() => {
    return buildInventoryProducts({
      productsCatalog,
      inventoryMap: editableInventory,
      grindType: "ground",
    });
  }, [productsCatalog, editableInventory]);

  const wholeProductsForUI = useMemo(() => {
    return buildInventoryProducts({
      productsCatalog,
      inventoryMap: editableInventory,
      grindType: "whole",
    });
  }, [productsCatalog, editableInventory]);

  // console.log(
  //   " GROUND INVENTORY EDITABLE FROM CONTEXT   :",
  //   JSON.stringify(groundProductsForUI, null, 2)
  // );
  // console.log(
  //   " INVENTORY PRODUCTS GROUND FROM CONTEXT   :",
  //   JSON.stringify(inventoryProductsGround, null, 2)
  // );
  // console.log(
  //   " WHOLE INVENTORY FOR UI   :",
  //   JSON.stringify(wholeProductsForUI, null, 2)
  // );
  console.log(
    " EDITABLE INVENTORY :",
    JSON.stringify(editableInventory, null, 2)
  );

  const handleChangeVariantQty = (productId, variantId, value) => {
    const sku = `${productId}:${variantId}`;

    setEditableInventory((prev) => ({
      ...prev,
      [sku]: Number(value || 0),
    }));
  };

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
    >
      {isLoading ? (
        <Global_activity_indicator
          caption="Wait, we are updating the inventory..."
          caption_width="70%"
        />
      ) : (
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
            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />
            <Container
              width="100%"
              color={theme.colors.bg.elements_bg}
              //color={"red"}
              // align="center"
              align={!hasChanges ? "flex-start" : "center"}
              // justify="space-around"
              justify={!hasChanges ? "flex-start" : "space-around"}
              direction="row"
            >
              <Spacer position="left" size="extraLarge">
                <Text variant="raleway_bold_18" textAlign="center">
                  Warehouse inventory
                </Text>
              </Spacer>
              {hasChanges && (
                <Regular_CTA
                  width="30%"
                  height={40}
                  color={theme.colors.ui.primary}
                  border_radius={"40px"}
                  caption={"Update"}
                  caption_text_variant="dm_sans_bold_16_white"
                  action={async () => {
                    try {
                      console.log("UPDATE CTA PRESSED");
                      console.log(
                        "WAREHOUSE ID:",
                        warehouseSelected?.warehouse_id
                      );
                      console.log(
                        "EDITABLE INVENTORY:",
                        JSON.stringify(editableInventory, null, 2)
                      );

                      console.log(
                        "WAREHOUSE ID BEFORE GOING TO CONTEXT:",
                        warehouseSelected?.warehouse_id
                      );
                      const res = await updateWarehouseInventory(
                        warehouseSelected?.warehouse_id,
                        editableInventory
                      );

                      if (res.success) {
                        showStatusSnackbar("Inventory updated successfully!");
                      }

                      console.log("UPDATE FINISHED");
                    } catch (error) {
                      console.log("UPDATE ERROR:", error?.message);
                      console.log(
                        "UPDATE ERROR RESPONSE:",
                        error?.response?.data
                      );
                    }
                  }}
                />
              )}
            </Container>
            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />
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
                align="center"
                justify="flex-start"
                direction="column"
                style={{ overflow: "visible" }}
              >
                <Container
                  width="100%"
                  color={theme.colors.bg.screens_bg}
                  style={{ alignSelf: "stretch" }}
                >
                  <Inventory_Accordion
                    groundProducts={groundProductsForUI}
                    wholeProducts={wholeProductsForUI}
                    onChangeVariantQty={handleChangeVariantQty}
                  />
                </Container>
              </Container>
            </ScrollView>
          </Container>
        </KeyboardAvoidingView>
      )}
      <>
        <Snackbar
          visible={statusSnackbarVisible}
          onDismiss={() => setStatusSnackbarVisible(false)}
          duration={Number.POSITIVE_INFINITY}
          action={{
            label: "Close",
            onPress: () => {
              setStatusSnackbarVisible(false);
              navigation.popToTop();
            },
          }}
          style={{
            minHeight: 80,
            marginHorizontal: 10,
            marginBottom: tabBarHeight,
            backgroundColor: theme.colors.ui.primary,
          }}
        >
          {statusSnackbarMessage}
        </Snackbar>
      </>
    </SafeArea>
  );
}
