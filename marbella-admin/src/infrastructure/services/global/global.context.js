import React, { useEffect, useState, createContext, useContext } from "react";

import { gettingAllProductsCatalogRequest } from "./global.services";
import { normalizeProductFromBackend } from "../../local_data/images_mapping/normalize_product_from_backend";
import { theme } from "../../theme/index";

export const GlobalContext = createContext();

export const Global_Context_Provider = ({ children }) => {
  const [productsCatalog, setProductsCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [globalLanguage, setGlobalLanguage] = useState("en"); // default to English
  const [statusSnackbarVisible, setStatusSnackbarVisible] = useState(false);
  const [statusSnackbarMessage, setStatusSnackbarMessage] = useState("");

  useEffect(() => {
    const gettingAllProductsCatalog = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const allProductsAtCatalog = await gettingAllProductsCatalogRequest();

        const normalized = await Promise.all(
          allProductsAtCatalog.map((product) =>
            normalizeProductFromBackend(product)
          )
        );

        setProductsCatalog(normalized);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
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

  const onlyDigits = (s = "") => String(s).replace(/\D/g, "");
  //   const showCTA = isPhoneComplete; // ✅ CTA only when complete

  const formatPhone = (input = "") => {
    const digits = onlyDigits(input).slice(0, 10);

    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)})${digits.slice(3)}`;
    return `(${digits.slice(0, 3)})${digits.slice(3, 6)}.${digits.slice(6)}`;
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

  const showStatusSnackbar = (message) => {
    setStatusSnackbarMessage(message);
    setStatusSnackbarVisible(true);
  };

  // ******** SNACKS BARS SHOW FUNCTIONS  ********

  const showErrorSnackbar = (message, onAction = hideSnackbar) => {
    showSnackbar({
      message,
      actionLabel: "OK",
      bgColor: theme.colors.ui.error,
      onAction,
    });
  };

  const showSuccessSnackbar = (message, onAction = hideSnackbar) => {
    showSnackbar({
      message,
      actionLabel: "OK",
      bgColor: theme.colors.ui.primary,
      onAction,
    });
  };

  const getText = (value, lang = "en") => {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);

    if (value && typeof value === "object") {
      return value[lang] || value.en || value.es || "";
    }

    return "";
  };
  // infrastructure/utils/translations.helpers.js

  const getTranslatedField = (field, language = "en", fallback = "en") => {
    if (!field) return "";

    if (typeof field === "object") {
      return field?.[language] || field?.[fallback] || "";
    }

    return field;
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

        // setSnackbar,
        snackbar,
        showSnackbar,
        hideSnackbar,
        formatPhone,
        statusSnackbarVisible,
        setStatusSnackbarVisible,
        showStatusSnackbar,
        statusSnackbarMessage,
        getText,
        getTranslatedField,
        showErrorSnackbar,
        showSuccessSnackbar,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
