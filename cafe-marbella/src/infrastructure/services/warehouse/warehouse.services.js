import axios from "axios";
import { environment } from "../../../util/env";

export const gettingWarehouseByIDRequest = async (warehouse_id) => {
  const { warehouseEndPoint } = environment;
  // console.log("WAREHOUSE ID AT SERVICE:", warehouse_id);

  try {
    try {
      const res = await axios.get(`${warehouseEndPoint}/getWarehouse`, {
        params: { warehouse_id },
        timeout: 15000,
      });
      // console.log("RESPONSE:", res.data);
      console.log(
        "WAREHOUSE BY ID AFTER REQUEST FUNCTION:",
        JSON.stringify(res.data, null, 2)
      );
      return res.data;
    } catch (error) {
      console.log("AXIOS message:", error.message);
      console.log("AXIOS code:", error.code);
      console.log("AXIOS status:", error.response?.status);
      console.log("AXIOS data:", error.response?.data);
      throw error;
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};
export const gettingClosestWarehouseForDeviceRequest = async (lat, lng) => {
  const { warehouseEndPoint } = environment;

  try {
    try {
      const res = await axios.get(`${warehouseEndPoint}/closestWH`, {
        params: { lat, lng },
        timeout: 15000,
      });
      // console.log("RESPONSE:", res.data);
      return res.data.closest;
    } catch (error) {
      console.log("AXIOS message:", error.message);
      console.log("AXIOS code:", error.code);
      console.log("AXIOS status:", error.response?.status);
      console.log("AXIOS data:", error.response?.data);
      throw error;
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const gettingRealTimeDistanceToOrderWHRequest = async (
  lat,
  lng,
  wLat,
  wLng
) => {
  const { warehouseEndPoint } = environment;

  const res = await axios.get(
    `${warehouseEndPoint}/realTimeSpecificWHDistance`,
    {
      params: {
        lat,
        lng,
        wLat,
        wLng,
      },
      timeout: 15000,
    }
  );

  return res.data;
};

// export const gettingRateRequestToShipStation = async (
//   ship_to,
//   ship_from,
//   weight = 6,
//   dimensions
// ) => {
//   try {
//     const res = await axios.post(
//       `${warehouseEndPoint}/gettingRateFromWarehouse`,
//       {
//         timeout: 15000,
//       }
//     );
//     // console.log("RESPONSE:", JSON.stringify(res.data, null, 2));
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching products catalog:", error);
//     throw error;
//   }
// };
export const gettingRateRequestToShipStation = async (
  ship_to,
  ship_from,
  weight = 6,
  dimensions = null
) => {
  const { warehouseEndPoint } = environment;
  try {
    // const body = {
    //   ship_to,
    //   ship_from,
    //   packages: [
    //     {
    //       package_code: "package",
    //       weight: {
    //         value: weight,
    //         unit: "ounce",
    //       },
    //       ...(dimensions && {
    //         dimensions: {
    //           unit: "inch",
    //           length: dimensions.length,
    //           width: dimensions.width,
    //           height: dimensions.height,
    //         },
    //       }),
    //     },
    //   ],
    // };
    const body = {
      shipment: {
        ship_to,
        ship_from,
        packages: [
          {
            package_code: "package",
            weight: {
              value: weight,
              unit: "ounce",
            },
          },
        ],
      },
    };

    const res = await axios.post(
      `${warehouseEndPoint}/gettingRateFromWarehouse`,
      body,
      {
        timeout: 15000,
      }
    );

    return res.data;
  } catch (error) {
    console.error(
      "Error getting shipping rate:",
      error.response?.data || error.message
    );
    throw error;
  }
};
// const gettingWarehouseByIDRequest = async (warehouse_id) => {
//   const { warehouseEndPoint } = environment;
//   // console.log("WAREHOUSE ID AT SERVICE:", warehouse_id);

//   try {
//     try {
//       const res = await axios.get(`${warehouseEndPoint}/getWarehouse`, {
//         params: { warehouse_id },
//         timeout: 15000,
//       });
//       // console.log("RESPONSE:", res.data);
//       return res.data;
//     } catch (error) {
//       console.log("AXIOS message:", error.message);
//       console.log("AXIOS code:", error.code);
//       console.log("AXIOS status:", error.response?.status);
//       console.log("AXIOS data:", error.response?.data);
//       throw error;
//     }
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     throw error;
//   }
// };
