import React, { useContext, useState, useMemo, useRef, useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "styled-components/native";

import { Container } from "../../components/containers/general.containers.js";
import { Go_Back_Header } from "../../components/headers/goBack_with_label.header.js";
import { SafeArea } from "../../components/spacers and globals/safe-area.component.js";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component.js";
import { Text } from "../../infrastructure/typography/text.component.js";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component.js";
import { Inventory_Accordion } from "../../components/others/inventory_accordion.component.js";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context.js";

export default function Warehouse_Inventory_View() {
  const navigation = useNavigation();
  const theme = useTheme();

  const {
    warehouseSelected,
    setWarehouseSelected,
    productsCatalog,
    buildInventoryProducts,
    isLoading,
  } = useContext(WarehouseContext);

  const syncInventoryToWarehouseDraft = () => {
    setWarehouseSelected((prev) => ({
      ...prev,
      inventory: editableInventory,
    }));
  };

  const { inventory } = warehouseSelected || {};
  console.log("INVENTORY FROM CONTEXT: ", JSON.stringify(inventory, null, 2));

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [editableInventory, setEditableInventory] = useState(inventory || {});
  const originalInventory = useRef(inventory || {});

  useEffect(() => {
    const nextInventory = warehouseSelected?.inventory || {};

    setEditableInventory(nextInventory);
    originalInventory.current = nextInventory;
  }, [warehouseSelected?.warehouse_id]);

  console.log(
    "WAREHOUSE SELECTED FROM CONTEXT: ",
    JSON.stringify(warehouseSelected, null, 2)
  );

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
            <Go_Back_Header
              label=""
              action={() => {
                syncInventoryToWarehouseDraft();
                navigation.goBack();
              }}
            />
            <Spacer position="top" size="large" />
            <Spacer position="top" size="large" />
            <Container
              width="100%"
              color={theme.colors.bg.elements_bg}
              align="center"
              justify="flex-start"
              direction="row"
            >
              <Spacer position="left" size="extraLarge">
                <Text variant="raleway_bold_18" textAlign="center">
                  Warehouse inventory
                </Text>
              </Spacer>
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
    </SafeArea>
  );
}
