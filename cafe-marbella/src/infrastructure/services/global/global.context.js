import React, { useEffect, useState, createContext, useContext } from "react";

import { gettingAllProductsCatalogRequest } from "./global.services";
import { normalizeProductFromBackend } from "../../local_data/images_mapping/normalize_product_from_backend";

export const GlobalContext = createContext();

export const Global_Context_Provider = ({ children }) => {
  const [productsCatalog, setProductsCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [globalLanguage, setGlobalLanguage] = useState("en"); // default to English

  useEffect(() => {
    const gettingAllProductsCatalog = async () => {
      try {
        const allProductsAtCatalog = await gettingAllProductsCatalogRequest();

        const normalized = allProductsAtCatalog.map(
          normalizeProductFromBackend
        );

        setProductsCatalog(normalized);
      } catch (err) {
        setError(err.message);
      }
    };
    gettingAllProductsCatalog();
  }, []);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);

    if (isNaN(date)) {
      throw new Error("Invalid date or timestamp");
    }

    const longFormat = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const shortFormat = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return {
      long: longFormat, // "November 15, 2025"
      short: shortFormat, // "Nov 15, 2025"
    };
  };

  const formatCentsToUSD = (cents = 0) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  // ✅ validate email format (for PIN reset flow)
  const isValidEmail = (email = "") =>
    /^[a-z0-9]+([._%+-][a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(
      String(email).trim()
    );

  const togglingGlobalLanguage = () => {
    setIsLoading(true);

    setTimeout(() => {
      try {
        setGlobalLanguage((prev) => (prev === "en" ? "es" : "en"));
      } catch (error) {
        setError("There was a problem switching languages. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  console.log("USER LANGUAGE AT GLOBAL CONTEXT:", globalLanguage);
  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        productsCatalog,
        formatCentsToUSD,
        error,
        formatDate,
        isValidEmail,
        setGlobalLanguage,
        globalLanguage,
        togglingGlobalLanguage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
