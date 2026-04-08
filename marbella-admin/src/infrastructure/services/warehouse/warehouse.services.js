import axios from "axios";
import { environment } from "../../../util/env";

export const gettingAllWarehousesRequest = async () => {
  const { warehouseEndPoint } = environment;
  // console.log("WAREHOUSE ID AT SERVICE:", warehouse_id);

  try {
    try {
      const res = await axios.get(`${warehouseEndPoint}/getAllWarehouses`);
      // console.log("RESPONSE:", res.data);
      // console.log(
      //   "WAREHOUSES  AFTER REQUEST FUNCTION:",
      //   JSON.stringify(res.data, null, 2)
      // );
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

export const updatingWarehouseInventoryRequest = async (
  warehouse_id,
  inventory_update
) => {
  const { warehouseEndPoint } = environment;

  try {
    try {
      const res = await axios.patch(
        `${warehouseEndPoint}/updateWarehouseInventory?warehouse_id=${warehouse_id}`,
        {
          inventory: inventory_update,
        },
        {
          timeout: 15000,
        }
      );
      console.log(
        "WAREHOUSE INVENTORY UPDATE RESPONSE:",
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
    console.error("Error updating warehouse inventory:", error);
    throw error;
  }
};

export const updateWarehouseRequest = async (warehouseData) => {
  const { warehouseEndPoint } = environment;

  try {
    try {
      const res = await axios.put(
        `${warehouseEndPoint}/updateWarehouse`,
        warehouseData,
        {
          timeout: 15000,
        }
      );
      console.log(
        "WAREHOUSE UPDATE RESPONSE:",
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
    console.error("Error updating warehouse:", error);
    throw error;
  }
};
export const createdWarehouseRequest = async (warehouseData) => {
  const { warehouseEndPoint } = environment;

  try {
    try {
      const res = await axios.post(
        `${warehouseEndPoint}/createWarehouse`,
        warehouseData,
        {
          timeout: 15000,
        }
      );
      console.log(
        "WAREHOUSE UPDATE RESPONSE:",
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
    console.error("Error updating warehouse:", error);
    throw error;
  }
};
