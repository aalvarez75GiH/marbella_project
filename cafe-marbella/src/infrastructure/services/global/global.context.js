import React, { useEffect, useState, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

import { gettingAllProductsCatalogRequest } from "./global.services";
import { normalizeProductFromBackend } from "../../local_data/images_mapping/normalize_product_from_backend";
import { theme } from "../../theme/index";
import { useTranslation } from "react-i18next";
import i18n from "../../translations/i18n";

export const GlobalContext = createContext();
const LANGUAGE_STORAGE_KEY = "@marbella/global_language";

export const Global_Context_Provider = ({ children }) => {
  const [productsCatalog, setProductsCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [globalLanguage, setGlobalLanguage] = useState("en"); // default to English

  const { t } = useTranslation();
  const ALLOWED_LANGUAGES = ["en", "es"];
  const DEFAULT_LANGUAGE = "en";

  const getDeviceLanguage = () => {
    const locales = Localization.getLocales();
    const languageCode = locales?.[0]?.languageCode;
    console.log("DEVICE LANGUAGE DETECTED:", languageCode);

    if (languageCode === "es") return "es";
    return "en";
  };

  //********** Hydration logic for products catalog and language preference on app startup **********/
  useEffect(() => {
    let isMounted = true;

    const loadProductsCatalog = async () => {
      try {
        const allProductsAtCatalog = await gettingAllProductsCatalogRequest();

        const normalized = await Promise.all(
          allProductsAtCatalog.map(normalizeProductFromBackend)
        );

        if (!isMounted) return;

        setProductsCatalog(normalized);
      } catch (err) {
        if (!isMounted) return;

        console.log("Load products catalog error:", err);
        setError(err?.message || "Could not load products catalog.");
      }
    };

    loadProductsCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const hydrateLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        console.log("STORED LANGUAGE FOR MARBELLA APP:", storedLanguage);

        const deviceLanguage = getDeviceLanguage();

        const languageToUse = ALLOWED_LANGUAGES.includes(storedLanguage)
          ? storedLanguage
          : deviceLanguage;

        await i18n.changeLanguage(languageToUse);

        if (!isMounted) return;

        setGlobalLanguage(languageToUse);

        if (!storedLanguage) {
          await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageToUse);
        }
      } catch (error) {
        console.log("Hydrate language error:", error);

        const fallbackLanguage = getDeviceLanguage();

        await i18n.changeLanguage(fallbackLanguage);

        if (isMounted) {
          setGlobalLanguage(fallbackLanguage);
        }
      }
    };

    hydrateLanguage();

    return () => {
      isMounted = false;
    };
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

  // infrastructure/utils/translations.helpers.js

  const getTranslatedField = (field, language = "en", fallback = "en") => {
    if (!field) return "";

    if (typeof field === "object") {
      return field?.[language] || field?.[fallback] || "";
    }

    return field;
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

  const showNameWarningSnackbar = (firstNameDataInputRef) => {
    showSnackbar({
      message: t("authentication_views.showNameWarningSnackbar.message"),
      actionLabel: "OK",
      bgColor: theme.colors.ui.error,
      onAction: () => {
        hideSnackbar();

        setTimeout(() => {
          firstNameDataInputRef.current?.focus();
        }, 150);
      },
    });
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
        getTranslatedField,

        showNameWarningSnackbar,
        showErrorSnackbar,
        showSuccessSnackbar,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
