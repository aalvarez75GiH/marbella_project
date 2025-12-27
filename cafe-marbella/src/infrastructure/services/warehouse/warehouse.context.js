import React, { useEffect, useState, createContext, useMemo } from "react";

import { products as catalogProducts } from "../../local data/products";
import { warehouses } from "../../local data/warehouses";

export const WarehouseContext = createContext();

export const Warehouse_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // later you’ll set this based on geolocation

  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]);

  console.log(
    "SELECTED WAREHOUSE: ",
    JSON.stringify(selectedWarehouse, null, 2)
  );
  const makeSku = (productId, variantId) => `${productId}:${variantId}`;

  const getStock = (warehouse, productId, variantId) => {
    const sku = makeSku(productId, variantId);
    return Number(warehouse?.inventory?.[sku] ?? 0);
  };

  //   const getWarehouseShopProductsWithPositiveStock = (
  //     productsList,
  //     warehouse,
  //     grindType
  //   ) => {
  //     return productsList
  //       .filter((p) => p.grindType === grindType)
  //       .map((p) => {
  //         const variantsWithStock = (p.size_variants ?? []).map((v) => ({
  //           ...v,
  //           stock: getStock(warehouse, p.id, v.id),
  //         }));

  //         const totalStock = variantsWithStock.reduce(
  //           (sum, v) => sum + (v.stock ?? 0),
  //           0
  //         );

  //         return {
  //           ...p,
  //           size_variants: variantsWithStock,
  //           totalStock,
  //           inStock: totalStock > 0,
  //         };
  //       })
  //       .filter((p) => p.inStock);
  //   };

  const getWarehouseShopProductsAll = (
    catalogProducts,
    warehouse,
    grindType
  ) => {
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
  const shopProductsGround = useMemo(() => {
    if (!selectedWarehouse) return [];
    return getWarehouseShopProductsAll(
      catalogProducts,
      selectedWarehouse,
      "ground"
    );
  }, [selectedWarehouse]);

  // console.log(
  //   "SHOP PRODUCTS GROUND AT WAREHOUSE CONTEXT: ",
  //   JSON.stringify(shopProductsGround, null, 2)
  // );
  const shopProductsWhole = useMemo(() => {
    if (!selectedWarehouse) return [];
    return getWarehouseShopProductsAll(
      catalogProducts,
      selectedWarehouse,
      "whole"
    );
  }, [selectedWarehouse]);

  // console.log(
  //   "SHOP PRODUCTS WHOLE AT WAREHOUSE CONTEXT: ",
  //   JSON.stringify(shopProductsWhole, null, 2)
  // );

  return (
    <WarehouseContext.Provider
      value={{
        isLoading,
        error,

        selectedWarehouse,
        setSelectedWarehouse,

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
