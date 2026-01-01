import axios from "axios";
import { environment } from "../../../util/env";

export const gettingAllProductsCatalogRequest = async () => {
  const { productsEndPoint } = environment;

  try {
    const res = await axios.get(`${productsEndPoint}/products`, {
      timeout: 15000,
    });
    // console.log("RESPONSE:", JSON.stringify(res.data, null, 2));
    return res.data;
  } catch (error) {
    console.error("Error fetching products catalog:", error);
    throw error;
  }
};
