import React, { useCallback, useContext, useEffect, useState } from "react";
import { Platform, Linking } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import { Text } from "../../infrastructure/typography/text.component.js";
import {
  Container,
  Action_Container,
} from "../containers/general.containers.js";
import { Spacer } from "../spacers and globals/optimized.spacer.component.js";
import { theme } from "../../infrastructure/theme/index.js";
import { Global_activity_indicator } from "../activity indicators/global_activity_indicator_screen.component.js";

import StoreIcon from "../../../assets/my_icons/storeIcon.svg";
import DeliveryIcon from "../../../assets/my_icons/deliveryTruckIcon.svg";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context.js";
import { GeolocationContext } from "../../infrastructure/services/geolocation/geolocation.context.js";

export const RT_Delivery_Information_Order_Tile = ({
  warehouse_name = "Warehouse",
  warehouse_address = `2159 West Broad st suite B{"\n"}Athens GA, 30606`,
  warehouse_lat,
  warehouse_lng,
  opening_time,
  closing_time,
  delivery_type,
  distance_to_warehouse_mi,
  customer_address = "",
}) => {
  const [realTimeDistanceInformation, setRealTimeDistanceInformation] =
    useState(null);
  //   console.log("Delivery_Information_Order_Tile delivery_type:", delivery_type);
  //   console.log("latitude inside tile:", warehouse_lat);
  //   console.log("longitude inside tile:", warehouse_lng);

  const { gettingRealTimeDistanceToOrderWH, isLoading } =
    useContext(WarehouseContext);
  const { deviceLat, deviceLng } = useContext(GeolocationContext);

  //   useEffect(() => {
  //     if (!deviceLat || !deviceLng || !warehouse_lat || !warehouse_lng) return;
  //     const run = async () => {
  //       try {
  //         const response = await gettingRealTimeDistanceToOrderWH(
  //           deviceLat,
  //           deviceLng,
  //           warehouse_lat,
  //           warehouse_lng
  //         );
  //         console.log(
  //           "Real-time distance to order warehouse response:",
  //           response
  //         );
  //         setRealTimeDistanceInformation(response);
  //       } catch (error) {
  //         console.log(
  //           "Error getting real-time distance to order warehouse:",
  //           error
  //         );
  //       }
  //     };
  //     run();
  //   }, [deviceLat, deviceLng, warehouse_lat, warehouse_lng]);

  useFocusEffect(
    useCallback(() => {
      if (!deviceLat || !deviceLng || !warehouse_lat || !warehouse_lng) return;

      let cancelled = false;

      const run = async () => {
        try {
          const response = await gettingRealTimeDistanceToOrderWH(
            deviceLat,
            deviceLng,
            warehouse_lat,
            warehouse_lng
          );
          if (!cancelled) setRealTimeDistanceInformation(response);
        } catch (e) {
          console.log("Error getting real-time distance:", e);
        }
      };

      run();

      return () => {
        cancelled = true;
      };
    }, [deviceLat, deviceLng, warehouse_lat, warehouse_lng])
  );

  const openMapsToWarehouse = (latitude, longitude) => {
    console.log("latitude inside function:", latitude);
    console.log("longitude inside function:", longitude);
    if (Platform.OS === "ios") {
      const url = `maps://?daddr=${latitude},${longitude}&dirflg=d`;
      Linking.openURL(url);
    } else {
      const url = `google.navigation:q=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  console.log(
    "DISTANCE INFORMATION:",
    realTimeDistanceInformation?.distance_in_miles ?? "loading..."
  );
  return delivery_type === "pickup" ? (
    <Container
      width="100%"
      //   height="25%"
      color={theme.colors.bg.elements_bg}
      align="center"
    >
      <Action_Container
        width="90%"
        color={theme.colors.ui.tertiary}
        //color={"pink"}
        justify="centers"
        align="center"
        border_radius="20px"
        direction="row"
        overflow="hidden"
        padding_vertical="5%"
        onPress={() => openMapsToWarehouse(warehouse_lat, warehouse_lng)}
      >
        <Container
          width="30%"
          //   height="95%"
          color={theme.colors.ui.tertiary}
          // color={"lightgreen"}
        >
          <StoreIcon width={60} height={60} fill={"#000000"} />
        </Container>
        <Container
          width="70%"
          color={theme.colors.ui.tertiary}
          //   color={"lightblue"}
        >
          <Container
            width="100%"
            justify="center"
            align="flex-start"
            color="transparent"
            padding_vertical="3%"
            //color={"lightblue"}
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_22">Pickup at</Text>
            </Spacer>
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_14">{warehouse_name}</Text>
            </Spacer>
          </Container>

          <Container
            width="100%"
            justify="center"
            align="flex-start"
            color="transparent"

            //color="yellow"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_14">
                {/* 2159 West Broad st suite B{"\n"}Athens GA, 30606 */}
                {warehouse_address}
              </Text>
            </Spacer>
          </Container>
          <Spacer position="top" size="small" />
          <Container
            width="100%"
            color="transparent"
            //color="purple"
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_14">
                Between {opening_time} - {closing_time}
              </Text>
            </Spacer>
          </Container>
          <Container
            width="100%"
            color="transparent"
            //color="pink"
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="large">
              {/* <Text variant="dm_sans_regular_14">3.4 miles away</Text> */}
              {isLoading ? (
                <Container
                  width="100%"
                  justify="center"
                  height="20px"
                  color="transparent"
                  //   color="red"
                >
                  <ActivityIndicator size={12} color={theme.colors.ui.black} />
                </Container>
              ) : (
                <Text variant="dm_sans_regular_14">
                  {realTimeDistanceInformation?.distance_in_miles ??
                    distance_to_warehouse_mi ??
                    "--"}{" "}
                  away
                </Text>
              )}
            </Spacer>
          </Container>
        </Container>
      </Action_Container>
    </Container>
  ) : (
    <Container
      width="100%"
      color={theme.colors.bg.elements_bg}
      overflow="hidden"
    >
      <Action_Container
        padding_vertical="5%"
        width="95%"
        color={theme.colors.ui.tertiary}
        // color={"green"}
        justify="centers"
        align="center"
        border_radius="20px"
        direction="row"
        overflow="hidden"
        onPress={() => openMapsToWarehouse(warehouse_lat, warehouse_lng)}
      >
        <Container
          padding_vertical="5%"
          width="30%"
          color={theme.colors.ui.tertiary}
          // color={"lightgreen"}
        >
          {/* <StoreIcon width={60} height={60} fill={"#000000"} /> */}
          <DeliveryIcon width={60} height={60} fill={"#000000"} />
        </Container>
        <Container
          width="70%"
          color={theme.colors.ui.tertiary}
          //   color={"lightblue"}
        >
          <Container
            width="100%"
            justify="center"
            padding_vertical="3%"
            align="flex-start"
            color="transparent"
            //color={"lightblue"}
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_bold_22">Delivey at</Text>
            </Spacer>
          </Container>

          <Container
            width="100%"
            justify="center"
            align="flex-start"
            color="transparent"
            //color="yellow"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_14">{customer_address}</Text>
            </Spacer>
          </Container>
          <Spacer position="top" size="small" />
          <Container
            width="100%"
            color="transparent"
            //color="purple"
            justify="center"
            align="flex-start"
          >
            <Spacer position="left" size="large">
              <Text variant="dm_sans_regular_14">
                Delivery by USPS - 1 to 3 days
              </Text>
            </Spacer>
          </Container>
        </Container>
      </Action_Container>
    </Container>
  );
};
