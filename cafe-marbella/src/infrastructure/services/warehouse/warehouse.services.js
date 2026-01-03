import axios from "axios";
import { environment } from "../../../util/env";

export const gettingWarehouseByIDRequest = async (warehouse_id) => {
  const { warehouseEndPoint } = environment;
  console.log("WAREHOUSE ID AT SERVICE:", warehouse_id);

  try {
    try {
      const res = await axios.get(`${warehouseEndPoint}/getWarehouse`, {
        params: { warehouse_id },
        timeout: 15000,
      });
      console.log("RESPONSE:", res.data);
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
      console.log("RESPONSE:", res.data);
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
