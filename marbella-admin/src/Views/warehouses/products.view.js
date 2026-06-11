import React, { useContext, useMemo, useState, useRef, useEffect } from "react";
import {
  SectionList,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import { Container } from "../../components/containers/general.containers";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Product_Initial_Card } from "../../components/cards/product_initial_card/product_intial.card";
import { Text } from "../../infrastructure/typography/text.component";
import { Back_And_CTA_Header } from "../../components/headers/back_and_cta.header";
import { Snack_Bar_Component } from "../../components/others/snack_bar.component";
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";
import { GlobalContext } from "../../infrastructure/services/global/global.context";

export default function Products_View() {
  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute();

  const {
    productsChosenForShop,
    handleChangeVariantQty,
    warehouseSelected,
    updateWarehouse,
    validateWarehouse,
    isLoading,
    createWarehouse,
  } = useContext(WarehouseContext);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const { coming_from, products: routeProducts } = route.params || {};
  const isCreateMode = coming_from === "add_cta";
  const isEditMode = coming_from === "warehouse_tile";

  const productsToRender = productsChosenForShop;

  const { snackbar, showErrorSnackbar, showSuccessSnackbar } =
    useContext(GlobalContext);

  // useEffect(() => {
  //   const showSub = Keyboard.addListener("keyboardDidShow", () => {
  //     setKeyboardVisible(true);
  //   });

  //   const hideSub = Keyboard.addListener("keyboardDidHide", () => {
  //     setKeyboardVisible(false);
  //   });

  //   return () => {
  //     showSub.remove();
  //     hideSub.remove();
  //   };
  // }, []);

  const originalWarehouseRef = useRef(null);
  useEffect(() => {
    if (!warehouseSelected?.warehouse_id) return;
    if (originalWarehouseRef.current) return;

    originalWarehouseRef.current = JSON.parse(
      JSON.stringify(warehouseSelected)
    );
  }, [warehouseSelected?.warehouse_id]);

  const hasChanges = useMemo(() => {
    if (isCreateMode) return true;

    const original = originalWarehouseRef.current;
    const current = warehouseSelected;

    if (!original || !current) return false;

    return JSON.stringify(original) !== JSON.stringify(current);
  }, [isCreateMode, warehouseSelected]);

  const shouldShowCTA = isCreateMode || hasChanges;

  const sections = useMemo(() => {
    if (!Array.isArray(productsToRender)) return [];

    const grouped = productsToRender.reduce((acc, product) => {
      const country =
        product?.country || product?.originCountry || "Other origins";

      if (!acc[country]) {
        acc[country] = [];
      }

      acc[country].push(product);
      return acc;
    }, {});

    return Object.entries(grouped).map(([title, data]) => ({
      title,
      data,
    }));
  }, [productsToRender]);
  console.log("SECTIONS:", JSON.stringify(sections, null, 2));

  const handleSubmitWarehouseFromProducts = async () => {
    Keyboard.dismiss();

    const validationError = validateWarehouse();

    if (validationError) {
      showErrorSnackbar(validationError);
      return;
    }

    const result = isCreateMode
      ? await createWarehouse(warehouseSelected)
      : await updateWarehouse(warehouseSelected);

    if (result?.success) {
      originalWarehouseRef.current = JSON.parse(
        JSON.stringify(result.warehouse || warehouseSelected)
      );

      showSuccessSnackbar(
        isCreateMode
          ? "Warehouse created successfully!"
          : "Warehouse updated successfully!"
      );
    } else {
      showErrorSnackbar(
        result?.error?.message ||
          (isCreateMode
            ? "Failed to create warehouse"
            : "Failed to update warehouse")
      );
    }
  };

  return (
    <SafeArea
      background_color={theme.colors.bg.elements_bg}
      style={{ flex: 1 }}
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
        <KeyboardAvoidingView
          //       style={{ flex: 1, width: "100%" }}
          // behavior={Platform.OS === "ios" ? "position" : undefined}
          // keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
          style={{ flex: 1, width: "100%" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <Container
            width="100%"
            height="100%"
            color={theme.colors.bg.screens_bg}
            justify="flex-start"
            align="center"
            style={{ flex: 1 }}
          >
            <Back_And_CTA_Header
              action_1={() => navigation.goBack()}
              action_2={handleSubmitWarehouseFromProducts}
              showCTA={shouldShowCTA}
              cta_caption={isCreateMode ? "Create" : "Update"}
            />

            <Spacer position="top" size="large" />

            <SectionList
              sections={sections}
              stickySectionHeadersEnabled={false}
              keyboardShouldPersistTaps="handled"
              // keyboardDismissMode="interactive"
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 20,
                    backgroundColor: theme.colors.bg.screens_bg,
                  }}
                />
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: "flex-start",
                width: "100%",
                paddingBottom: 80,
                flexGrow: 1,
                backgroundColor: theme.colors.bg.elements_bg,
              }}
              renderSectionHeader={({ section }) => (
                <Container
                  width="100%"
                  padding_vertical="12px"
                  margin_top="16px"
                  margin_bottom="12px"
                  color={theme.colors.bg.elements_bg}
                  justify="flex-start"
                  align="flex-start"
                >
                  <Spacer position="left" size="large">
                    <Text variant="dm_sans_bold_20">{section.title}</Text>
                  </Spacer>
                </Container>
              )}
              renderItem={({ item }) => (
                <Product_Initial_Card
                  item={item}
                  onChangeVariantQty={handleChangeVariantQty}
                />
              )}
            />

            <Spacer position="top" size="large" />
          </Container>

          <Snack_Bar_Component
            snackbar={snackbar}
            bottom_ios={40}
            bottom_android={40}
          />
        </KeyboardAvoidingView>
        // <>
        //   <Container
        //     width="100%"
        //     height="100%"
        //     // color={theme.colors.bg.elements_bg}
        //     color={theme.colors.bg.screens_bg}
        //     // color={"red"}
        //     justify="flex-start"
        //     align="center"
        //     style={{ paddingBottom: 50 }}
        //   >
        //     <Back_And_CTA_Header
        //       action_1={() => navigation.goBack()}
        //       action_2={handleSubmitWarehouseFromProducts}
        //       showCTA={shouldShowCTA}
        //       cta_caption={isCreateMode ? "Create" : "Update"}
        //     />
        //     <Spacer position="top" size="large" />
        //     <SectionList
        //       sections={sections}
        //       stickySectionHeadersEnabled={false}
        //       ItemSeparatorComponent={() => (
        //         <View
        //           style={{
        //             height: 20,
        //             backgroundColor: theme.colors.bg.screens_bg,
        //           }}
        //         />
        //       )}
        //       keyExtractor={(item) => item.id}
        //       showsVerticalScrollIndicator={false}
        //       contentContainerStyle={{
        //         alignItems: "flex-start",
        //         width: "100%",
        //         paddingBottom: 24,
        //         flexGrow: 1,
        //         backgroundColor: theme.colors.bg.elements_bg,
        //       }}
        //       renderSectionHeader={({ section }) => (
        //         <Container
        //           width="100%"
        //           padding_vertical="12px"
        //           margin_top="16px"
        //           margin_bottom="12px"
        //           color={theme.colors.bg.elements_bg}
        //           justify="flex-start"
        //           align="flex-start"
        //         >
        //           <Spacer position="left" size="large">
        //             <Text variant="dm_sans_bold_20">{section.title}</Text>
        //           </Spacer>
        //         </Container>
        //       )}
        //       renderItem={({ item }) => (
        //         <Product_Initial_Card
        //           item={item}
        //           onChangeVariantQty={handleChangeVariantQty}
        //         />
        //       )}
        //     />
        //     <Spacer position="top" size="large" />
        //   </Container>
        //   <Snack_Bar_Component
        //     snackbar={snackbar}
        //     bottom_ios={40}
        //     bottom_android={40}
        //   />
        // </>
      )}
    </SafeArea>
  );
}
