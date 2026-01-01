import React, { useEffect, useState, createContext, useContext } from "react";

import { gettingAllProductsCatalogRequest } from "./global.services";
// import { normalizeProductFromBackend } from "../../utils/normalize_product_from_backend";

export const GlobalContext = createContext();

export const Global_Context_Provider = ({ children }) => {
  const [productsCatalog, setProductsCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const gettingAllProductsCatalog = async () => {
      //   setIsLoading(true);
      try {
        // Simulate an API call to fetch products catalog
        // const response = await fetch("https://fakestoreapi.com/products");
        const allProductsAtCatalog = await gettingAllProductsCatalogRequest();
        // const data = await response.json();
        console.log(
          "PRODUCTS CATALOG FROM API CALL: ",
          JSON.stringify(allProductsAtCatalog, null, 2)
        );
        // const normalized = allProductsAtCatalog.map(
        //   normalizeProductFromBackend
        // );
        setProductsCatalog(normalized);
        // setIsLoading(false);
      } catch (err) {
        setError(err.message);
        // setIsLoading(false);
      }
    };
    gettingAllProductsCatalog();
  }, []);
  // // ✅ compute data for shop
  // const shopProductsGround = useMemo(() => {
  //     if (!selectedWarehouse) return [];
  //     return getWarehouseShopProductsAll(
  //       catalogProducts,
  //       selectedWarehouse,
  //       "ground"
  //     );
  //   }, [selectedWarehouse]);

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        productsCatalog,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
