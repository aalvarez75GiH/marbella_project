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
