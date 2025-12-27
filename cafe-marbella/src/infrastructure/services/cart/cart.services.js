import axios from "axios";
import { environment } from "../../../util/env";

export const gettingCartByUserIDRequest = async (user_id) => {
  const { cartsEndPoint } = environment;
  console.log("USER ID AT SERVICE:", user_id);

  try {
    try {
      const res = await axios.get(cartsEndPoint, {
        params: { user_id },
        timeout: 15000,
      });
      return res.data;
    } catch (error) {
      console.log("AXIOS message:", error.message);
      console.log("AXIOS code:", error.code);
      console.log("AXIOS status:", error.response?.status);
      console.log("AXIOS data:", error.response?.data);
      throw error;
    }
    console.log("RESPONSE:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};
