import React, { useEffect, useState, createContext, useContext } from "react";

import { gettingAllProductsCatalogRequest } from "./global.services";
import { normalizeProductFromBackend } from "../../local_data/images_mapping/normalize_product_from_backend";

export const GlobalContext = createContext();

export const Global_Context_Provider = ({ children }) => {
  const [productsCatalog, setProductsCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const gettingAllProductsCatalog = async () => {
      //   setIsLoading(true);
      try {
        const allProductsAtCatalog = await gettingAllProductsCatalogRequest();
        // console.log(
        //   "ALL PRODUCTS AT CATALOG FROM API CALL:",
        //   JSON.stringify(allProductsAtCatalog, null, 2)
        // );
        const normalized = allProductsAtCatalog.map(
          normalizeProductFromBackend
        );

        setProductsCatalog(normalized);
        // setIsLoading(false);
      } catch (err) {
        setError(err.message);
        // setIsLoading(false);
      }
    };
    gettingAllProductsCatalog();
  }, []);

  const formatCentsToUSD = (cents = 0) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        productsCatalog,
        formatCentsToUSD,
        error,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
