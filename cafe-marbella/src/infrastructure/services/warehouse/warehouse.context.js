import React, {
  useEffect,
  useState,
  createContext,
  useMemo,
  useContext,
} from "react";
import {
  gettingWarehouseByIDRequest,
  gettingClosestWarehouseForDeviceRequest,
  gettingRealTimeDistanceToOrderWHRequest,
  gettingRateRequestToShipStation,
} from "./warehouse.services";

import { GlobalContext } from "../global/global.context";
import { GeolocationContext } from "../geolocation/geolocation.context";

export const WarehouseContext = createContext();

export const Warehouse_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myWarehouse, setMyWarehouse] = useState(null);
  const [productsChosenForShop, setProductsChosenForShop] = useState([]);
  // later you’ll set this based on geolocation
  const { productsCatalog } = useContext(GlobalContext);

  const { deviceLat, deviceLng } = useContext(GeolocationContext);
  // let deviceLat = 36.1060631;
  // let deviceLng = -86.74432890000001;
  // console.log("MY WAREHOUSE CONTEXT AT CONTEXT", myWarehouse);
  useEffect(() => {
    if (typeof deviceLat !== "number" || typeof deviceLng !== "number") {
      console.log("Device location not ready yet:", deviceLat, deviceLng);
      return;
    }

    const gettingClosestWarehouseForDevice = async () => {
      try {
        const closestWarehouse = await gettingClosestWarehouseForDeviceRequest(
          deviceLat,
          deviceLng
        );

        setMyWarehouse(closestWarehouse);
        // console.log(
        //   "CLOSEST WAREHOUSE AT CONTEXT:",
        //   JSON.stringify(closestWarehouse, null, 2)
        // );
      } catch (error) {
        console.error("Error fetching closest warehouse:", error);
      }
    };

    gettingClosestWarehouseForDevice();
  }, [deviceLat, deviceLng]);

  const makeSku = (productId, variantId) => `${productId}:${variantId}`;

  const getStock = (warehouse, productId, variantId) => {
    const sku = makeSku(productId, variantId);
    return Number(warehouse?.inventory?.[sku] ?? 0);
  };

  const gettingRealTimeDistanceToOrderWH = async (
    deviceLat,
    deviceLng,
    warehouse_lat,
    warehouse_lng
  ) => {
    setIsLoading(true);
    try {
      const response = await gettingRealTimeDistanceToOrderWHRequest(
        deviceLat,
        deviceLng,
        warehouse_lat,
        warehouse_lng
      );
      // console.log("RESPONSE BY REAL TIME SHIT:", response);
      return response;
    } catch (error) {
      console.error("Error fetching real-time distance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const buildInventoryProducts = (catalogProducts, warehouse, grindType) => {
    const roastOrder = {
      light: 1,
      medium: 2,
      dark: 3,
    };

    return catalogProducts
      .filter((p) => {
        const productGrindType = String(p?.grindType || "")
          .trim()
          .toLowerCase();
        const requestedGrindType = String(grindType || "")
          .trim()
          .toLowerCase();
        const isActive = p?.active !== false;

        return productGrindType === requestedGrindType && isActive;
      })
      .map((p) => {
        const variantsWithStock = (p.size_variants ?? []).map((v) => ({
          ...v,
          stock: getStock(warehouse, p.id, v.id),
        }));

        const totalStock = variantsWithStock.reduce(
          (sum, v) => sum + Number(v.stock ?? 0),
          0
        );

        return {
          ...p,
          size_variants: variantsWithStock,
          totalStock,
          inStock: totalStock > 0,
        };
      })
      .sort((a, b) => {
        const aPriority = Number(a?.priority ?? Number.MAX_SAFE_INTEGER);
        const bPriority = Number(b?.priority ?? Number.MAX_SAFE_INTEGER);

        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }

        const aCountry = String(a?.country || a?.originCountry || "")
          .trim()
          .toLowerCase();
        const bCountry = String(b?.country || b?.originCountry || "")
          .trim()
          .toLowerCase();

        if (aCountry !== bCountry) {
          return aCountry.localeCompare(bCountry);
        }

        const aRoast = String(a?.roast || "")
          .trim()
          .toLowerCase();
        const bRoast = String(b?.roast || "")
          .trim()
          .toLowerCase();

        const aRoastOrder = roastOrder[aRoast] ?? 999;
        const bRoastOrder = roastOrder[bRoast] ?? 999;

        if (aRoastOrder !== bRoastOrder) {
          return aRoastOrder - bRoastOrder;
        }

        return String(a?.name || "").localeCompare(String(b?.name || ""));
      });
  };

  const gettingWarehouseByID = async (warehouse_id) => {
    setIsLoading(true);
    try {
      const warehouse = await gettingWarehouseByIDRequest(warehouse_id);
      // console.log(
      //   "WAREHOUSE BY ID AT CONTEXT REQUEST FUNCTION:",
      //   JSON.stringify(warehouse, null, 2)
      // );
      setMyWarehouse(warehouse);
    } catch (error) {
      setError(error);
      // console.error("Error fetching warehouse by ID:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const gettingRateForDelivery = async (ship_to, ship_from) => {
    try {
      const cheapestRate = await gettingRateRequestToShipStation(
        ship_to,
        ship_from
      );
      console.log(
        "CHEAPEST RATE RESPONSE AT CONTEXT:",
        JSON.stringify(cheapestRate, null, 2)
      );
      return cheapestRate;
    } catch (error) {
      console.log("Error getting delivery rate:", error);
    }
  };

  // ✅ compute data for shop
  const shopProductsGround = useMemo(() => {
    if (!myWarehouse) return [];
    // return getWarehouseShopProductsAll(productsCatalog, myWarehouse, "ground");
    return buildInventoryProducts(productsCatalog, myWarehouse, "ground");
  }, [myWarehouse, productsCatalog]);

  const shopProductsWhole = useMemo(() => {
    if (!myWarehouse) return [];
    return buildInventoryProducts(productsCatalog, myWarehouse, "whole");
    // return getWarehouseShopProductsAll(productsCatalog, myWarehouse, "whole");
  }, [myWarehouse, productsCatalog]);

  return (
    <WarehouseContext.Provider
      value={{
        isLoading,
        error,

        myWarehouse,
        setMyWarehouse,

        shopProductsGround,
        shopProductsWhole,

        makeSku,
        getStock,
        gettingRealTimeDistanceToOrderWH,

        gettingWarehouseByID,

        productsChosenForShop,
        setProductsChosenForShop,

        gettingRateForDelivery,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};
