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
  console.log("Fetching orders grouped by month for user_id:", user_id);
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

export const getOrderByIdRequest = async (orderId) => {
  const { ordersEndPoint } = environment;
  const response = await axios.get(`${ordersEndPoint}/order/${orderId}`);
  return response.data;
};

// export const getOrderByIdRequest = async (orderId) => {
//   const response = await axios.get(`${ordersEndPoint}/${orderId}`);
//   return response.data;
// };
