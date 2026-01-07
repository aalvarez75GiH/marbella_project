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
} from "./warehouse.services";

import { GlobalContext } from "../global/global.context";
import { geolocationContext } from "../geolocation/geolocation.context";

export const WarehouseContext = createContext();

export const Warehouse_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myWarehouse, setMyWarehouse] = useState(null);
  useState(null);
  // later you’ll set this based on geolocation
  const { productsCatalog } = useContext(GlobalContext);

  const { deviceLat, deviceLng } = useContext(geolocationContext);

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
        console.log(
          "DISTANCE IN MILES AT CONTEXT:",
          closestWarehouse.distance_in_miles
        );
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

  // const getWarehouseById = (warehouseId) => {
  //   return warehouses.find((w) => w.id === warehouseId);
  // };

  // Getting products of the closest warehouse with positive stock
  const getWarehouseProductsWithPositiveStock = (
    productsList,
    warehouse,
    grindType
  ) => {
    return productsList
      .filter((p) => p.grindType === grindType)
      .map((p) => {
        const variantsWithStock = (p.size_variants ?? []).map((v) => ({
          ...v,
          stock: getStock(warehouse, p.id, v.id),
        }));

        const totalStock = variantsWithStock.reduce(
          (sum, v) => sum + (v.stock ?? 0),
          0
        );

        return {
          ...p,
          size_variants: variantsWithStock,
          totalStock,
          inStock: totalStock > 0,
        };
      })
      .filter((p) => p.inStock);
  };

  // Getting all products of the closest warehouse not matter stock
  const getWarehouseProductsAll = (catalogProducts, warehouse, grindType) => {
    return catalogProducts
      .filter((p) => p.grindType === grindType)
      .map((p) => {
        const variantsWithStock = (p.size_variants ?? []).map((v) => ({
          ...v,
          stock: getStock(warehouse, p.id, v.id),
        }));

        const totalStock = variantsWithStock.reduce(
          (sum, v) => sum + (v.stock ?? 0),
          0
        );

        return {
          ...p,
          size_variants: variantsWithStock,
          totalStock,
          inStock: totalStock > 0,
        };
      });
  };

  // ✅ compute data for shop
  // const shopProductsGround = useMemo(() => {
  //   if (!myWarehouse) return [];
  //   // return getWarehouseShopProductsAll(productsCatalog, myWarehouse, "ground");
  //   return getWarehouseProductsWithPositiveStock(
  //     productsCatalog,
  //     myWarehouse,
  //     "ground"
  //   );
  // }, [myWarehouse, productsCatalog]);
  // ✅ compute data for shop
  const shopProductsGround = useMemo(() => {
    if (!myWarehouse) return [];
    // return getWarehouseShopProductsAll(productsCatalog, myWarehouse, "ground");
    return getWarehouseProductsAll(productsCatalog, myWarehouse, "ground");
  }, [myWarehouse, productsCatalog]);

  // const shopProductsWhole = useMemo(() => {
  //   if (!myWarehouse) return [];
  //   return getWarehouseProductsWithPositiveStock(
  //     productsCatalog,
  //     myWarehouse,
  //     "whole"
  //   );
  //   // return getWarehouseShopProductsAll(productsCatalog, myWarehouse, "whole");
  // }, [myWarehouse, productsCatalog]);

  const shopProductsWhole = useMemo(() => {
    if (!myWarehouse) return [];
    return getWarehouseProductsAll(productsCatalog, myWarehouse, "whole");
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
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};
