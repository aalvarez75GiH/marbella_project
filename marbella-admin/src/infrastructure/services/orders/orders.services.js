import axios from "axios";
import { environment } from "../../../util/env";

export const gettingAllOrdersByUserIDRequest = async (user_id) => {
  const { ordersEndPoint } = environment;

  try {
    const res = await axios.get(
      `${ordersEndPoint}/ordersByUserID?user_id=${user_id}`,
      {
        timeout: 15000,
      }
    );
    // console.log("RESPONSE:", JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (error) {
    console.error("Error fetching products catalog:", error);
    throw error;
  }
};
export const gettingAllOrdersByUserIDGroupedByMonthRequest = async (
  user_id
) => {
  const { ordersEndPoint } = environment;

  try {
    const res = await axios.get(
      `${ordersEndPoint}/ordersByUserIDGrouped?user_id=${user_id}`,
      {
        timeout: 15000,
      }
    );
    // console.log("RESPONSE:", JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (error) {
    console.error("Error fetching products catalog:", error);
    throw error;
  }
};

export const getOrderByPickupTokenRequest = async (token) => {
  const { ordersEndPoint } = environment;

  try {
    const res = await axios.post(
      `${ordersEndPoint}/order_qr_scanned`,
      { token },
      {
        timeout: 15000,
      }
    );
    return res.data;
  } catch (error) {
    // console.error("Error fetching order by pickup token:");
    // console.error("status:", error?.response?.status);
    // console.error("data:", error?.response?.data);
    // throw error;
    return error;
  }
};

export const updateOrderStatusRequest = async (order_id, order_status) => {
  const { ordersEndPoint } = environment;

  try {
    const res = await axios.patch(
      `${ordersEndPoint}/${order_id}/status`,
      { order_status },
      {
        timeout: 15000,
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
