import axios from "axios";
import { environment } from "../../../util/env";

export const gettingCartByUserIDRequest = async (user_id) => {
  const { cartsEndPoint } = environment;
  console.log("USER ID AT SERVICE:", user_id);

  try {
    try {
      const res = await axios.get(`${cartsEndPoint}/cart`, {
        params: { user_id },
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
    console.log("RESPONSE:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};
export const updatingProductsCart = async (user_id, product) => {
  const { cartsEndPoint } = environment;
  console.log("USER ID AT SERVICE:", user_id);
  console.log("PRODUCT TO ADD AT SERVICE:", JSON.stringify(product, null, 2));
  const baseUrl = cartsEndPoint; // Replace with your backend base URL
  const endpoint = `${baseUrl}/products_cart`;
  try {
    const res = await axios.put(endpoint, product, {
      params: { user_id },
      timeout: 15000, // Optional timeout
    });

    console.log("RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

export const IncOrDecProductsCartQty = async (user_id, product, task) => {
  const { cartsEndPoint } = environment;
  console.log("USER ID AT SERVICE:", user_id);
  console.log("PRODUCT TO ADD AT SERVICE:", JSON.stringify(product, null, 2));
  const baseUrl = cartsEndPoint; // Replace with your backend base URL
  const endpoint = `${baseUrl}/adjust-qty?user_id=${user_id}&task=${task}`;
  try {
    const res = await axios.put(endpoint, product);
    console.log("RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

export const removingCartItemRequest = async (
  user_id,
  productId,
  variantId
) => {
  const { cartsEndPoint } = environment;
  console.log("USER ID AT SERVICE:", user_id);
  // console.log("PRODUCT TO ADD AT SERVICE:", JSON.stringify(product, null, 2));
  const baseUrl = cartsEndPoint; // Replace with your backend base URL
  const endpoint = `${baseUrl}/item?user_id=${user_id}&product_id=${productId}&variant_id=${variantId}`;
  try {
    const res = await axios.delete(endpoint);
    console.log("RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};
