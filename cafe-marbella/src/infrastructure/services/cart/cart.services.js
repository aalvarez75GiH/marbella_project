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
      // console.log("RESPONSE:", res.data);
      return res.data;
    } catch (error) {
      console.log("AXIOS message:", error.message);
      console.log("AXIOS code:", error.code);
      console.log("AXIOS status:", error.response?.status);
      console.log("AXIOS data:", error.response?.data);
      throw error;
    }
    // console.log("RESPONSE:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};
export const updatingProductsCart = async (user_id, product) => {
  const { cartsEndPoint } = environment;
  const endpoint = `${cartsEndPoint}/products_cart`;
  try {
    const res = await axios.put(endpoint, product, {
      params: { user_id },
      timeout: 15000, // Optional timeout
    });

    // console.log("RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

export const IncOrDecProductsCartQty = async (user_id, product, task) => {
  const { cartsEndPoint } = environment;
  const endpoint = `${cartsEndPoint}/adjust-qty?user_id=${user_id}&task=${task}`;
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
  const endpoint = `${cartsEndPoint}/item?user_id=${user_id}&product_id=${productId}&variant_id=${variantId}`;
  try {
    const res = await axios.delete(endpoint);
    console.log("RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};
export const resettingCartRequest = async (user_id) => {
  console.log("Resetting cart for user_id at services:", user_id);
  const { cartsEndPoint } = environment;
  const endpoint = `${cartsEndPoint}/clear_shopping_cart?user_id=${user_id}`;
  console.log("RESET CART ENDPOINT:", endpoint);
  try {
    const res = await axios.put(endpoint);
    console.log("RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};
