import React, { useEffect, useState, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { gettingAllProductsCatalogRequest } from "./global.services";
import { normalizeProductFromBackend } from "../../local_data/images_mapping/normalize_product_from_backend";
import { theme } from "../../theme/index";
import i18n from "../../translations/i18n";

export const GlobalContext = createContext();
const LANGUAGE_STORAGE_KEY = "@marbella/global_language";

export const Global_Context_Provider = ({ children }) => {
  const [productsCatalog, setProductsCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [globalLanguage, setGlobalLanguage] = useState("en"); // default to English

  useEffect(() => {
    const gettingAllProductsCatalog = async () => {
      try {
        const allProductsAtCatalog = await gettingAllProductsCatalogRequest();

        const normalized = await Promise.all(
          allProductsAtCatalog.map((p) => normalizeProductFromBackend(p))
        );
        const vzlaGroundLightProduct = normalized.find((p) =>
          p?.size_variants?.some(
            (v) =>
              Array.isArray(v?.images_path) &&
              v.images_path.includes(
                "Venezuela/ground/light/250/vzla_bag_gb.png"
              )
          )
        );

        setProductsCatalog(normalized);
      } catch (err) {
        setError(err.message);
      }
    };
    gettingAllProductsCatalog();
  }, []);

  useEffect(() => {
    const hydrateLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

        const languageToUse =
          storedLanguage === "en" || storedLanguage === "es"
            ? storedLanguage
            : "en";

        setGlobalLanguage(languageToUse);
        await i18n.changeLanguage(languageToUse);

        if (!storedLanguage) {
          await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
        }
      } catch (error) {
        console.log("Hydrate language error:", error);

        setGlobalLanguage("en");
        await i18n.changeLanguage("en");
      }
    };

    hydrateLanguage();
  }, []);

  const formatDate = (inputDate) => {
    console.log("INPUT DATE TO FORMAT:", inputDate);
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

  const toggleGlobalLanguage = async () => {
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const nextLanguage = globalLanguage === "en" ? "es" : "en";

        setGlobalLanguage(nextLanguage);
        await i18n.changeLanguage(nextLanguage);
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
      } catch (error) {
        console.log("Language toggle error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  //********** logic to control Snackbar from global context (for error handling and user feedback) **********/
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    actionLabel: "OK",
    onAction: null,
    bgColor: theme.colors.ui.primary,
  });

  const showSnackbar = ({
    message,
    actionLabel = "OK",
    onAction = null,
    bgColor = theme.colors.ui.primary,
  }) => {
    setSnackbar({
      visible: true,
      message,
      actionLabel,
      onAction,
      bgColor,
    });
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  // console.log("USER LANGUAGE AT GLOBAL CONTEXT:", globalLanguage);
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
        toggleGlobalLanguage,

        // setSnackbar,
        snackbar,
        showSnackbar,
        hideSnackbar,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
