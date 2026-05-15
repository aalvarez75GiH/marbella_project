import React from "react";
import { ScrollView } from "react-native";
import { useTheme } from "styled-components/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";

import {
  Container,
  Action_Container,
} from "../../components/containers/general.containers";
import { NewSafeArea } from "../../components/spacers and globals/safe-area.component";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Exit_Header_With_Label } from "../../components/headers/exit_with_label.header";
import { Text } from "../../infrastructure/typography/text.component";

export default function Delivery_Order_Label_View() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const { shipping_label } = route.params || {};
  const label = shipping_label;

  const printLabel = async () => {
    if (!label?.label_url) return;

    await Print.printAsync({
      uri: label.label_url,
    });
  };

  //   const shareLabel = async () => {
  //     if (!label?.label_url) return;

  //     const fileUri =
  //       FileSystem.documentDirectory + `ups-label-${label.tracking_number}.pdf`;

  //     await FileSystem.downloadAsync(label.label_url, fileUri);

  //     await Sharing.shareAsync(fileUri, {
  //       mimeType: "application/pdf",
  //       dialogTitle: "Share UPS label",
  //     });
  //   };

  const openLabelExternally = async () => {
    if (!label?.label_url) return;
    await Linking.openURL(label.label_url);
  };

  return (
    <NewSafeArea
      background_color={theme.colors.bg.elements_bg}
      edges={["top", "left", "right"]}
      style={{ flex: 1 }}
    >
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.screens_bg}
        justify="flex-start"
        align="center"
      >
        <Exit_Header_With_Label
          label="Delivery Label"
          action={() => navigation.goBack()}
          orientation="right"
        />

        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{
            alignItems: "center",
            paddingTop: 24,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Container
            width="92%"
            color={theme.colors.bg.elements_bg}
            border_radius="14px"
            padding_vertical="20px"
            align="flex-start"
          >
            <Spacer position="left" size="large">
              <Text variant="raleway_bold_18">UPS Ground Label</Text>
            </Spacer>

            <Spacer position="top" size="medium" />

            <Spacer position="left" size="large">
              <Text variant="raleway_bold_14_grey">Tracking number</Text>
              <Text variant="raleway_bold_18">
                {label?.tracking_number || "N/A"}
              </Text>
            </Spacer>

            <Spacer position="top" size="medium" />

            <Spacer position="left" size="large">
              <Text variant="raleway_bold_14_grey">Status</Text>
              <Text variant="raleway_bold_18">{label?.status || "N/A"}</Text>
            </Spacer>

            <Spacer position="top" size="medium" />

            <Spacer position="left" size="large">
              <Text variant="raleway_bold_14_grey">Shipment cost</Text>
              <Text variant="raleway_bold_18">
                ${label?.shipment_cost?.amount?.toFixed(2) || "0.00"}
              </Text>
            </Spacer>
          </Container>

          <Spacer position="top" size="large" />

          <Action_Container
            width="92%"
            height="56px"
            border_radius="12px"
            color="#111111"
            align="center"
            justify="center"
            onPress={printLabel}
          >
            <Text variant="raleway_bold_16" style={{ color: "white" }}>
              Print UPS Label
            </Text>
          </Action_Container>

          <Spacer position="top" size="medium" />

          {/* <Action_Container
            width="92%"
            height="56px"
            border_radius="12px"
            color={theme.colors.bg.elements_bg}
            align="center"
            justify="center"
            onPress={shareLabel}
          >
            <Text variant="raleway_bold_16">Share / Save Label PDF</Text>
          </Action_Container>
          <Spacer position="top" size="medium" /> */}
          <Action_Container
            width="92%"
            height="56px"
            border_radius="12px"
            color={theme.colors.bg.elements_bg}
            align="center"
            justify="center"
            onPress={openLabelExternally}
          >
            <Text variant="raleway_bold_16">Open Label PDF</Text>
          </Action_Container>
        </ScrollView>
      </Container>
    </NewSafeArea>
  );
}
