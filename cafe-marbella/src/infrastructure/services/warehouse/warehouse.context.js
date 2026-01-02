import React, {
  useEffect,
  useState,
  createContext,
  useMemo,
  useContext,
} from "react";
import { gettingWarehouseByIDRequest } from "./warehouse.services";

import { GlobalContext } from "../global/global.context";

export const WarehouseContext = createContext();

export const Warehouse_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myWarehouse, setMyWarehouse] = useState(null);
  // later you’ll set this based on geolocation
  const { productsCatalog } = useContext(GlobalContext);

  useEffect(() => {
    const gettingWarehouseByUserID = async (warehouse_id) => {
      try {
        console.log("Fetching warehouse:", warehouse_id);
        const myWarehouse = await gettingWarehouseByIDRequest(warehouse_id);
        console.log(
          "MY WAREHOUSE FROM API CALL:",
          JSON.stringify(myWarehouse, null, 2)
        );
        setMyWarehouse(myWarehouse);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    gettingWarehouseByUserID("9958f0e2-d900-401a-96ab-b2fcf3636782");
    // gettingWarehouseByUserID("35832b23-55af-4d31-9a16-62ecbf66707c");
  }, []);

  const makeSku = (productId, variantId) => `${productId}:${variantId}`;

  const getStock = (warehouse, productId, variantId) => {
    const sku = makeSku(productId, variantId);
    return Number(warehouse?.inventory?.[sku] ?? 0);
  };

  // const getWarehouseById = (warehouseId) => {
  //   return warehouses.find((w) => w.id === warehouseId);
  // };

  const getWarehouseShopProductsWithPositiveStock = (
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
    if (!myWarehouse) return [];
    // return getWarehouseShopProductsAll(productsCatalog, myWarehouse, "ground");
    return getWarehouseShopProductsWithPositiveStock(
      productsCatalog,
      myWarehouse,
      "ground"
    );
  }, [myWarehouse, productsCatalog]);

  const shopProductsWhole = useMemo(() => {
    if (!myWarehouse) return [];
    return getWarehouseShopProductsWithPositiveStock(
      productsCatalog,
      myWarehouse,
      "whole"
    );
    // return getWarehouseShopProductsAll(productsCatalog, myWarehouse, "whole");
  }, [myWarehouse, productsCatalog]);

  return (
    <WarehouseContext.Provider
      value={{
        isLoading,
        error,

        myWarehouse,
        setMyWarehouse,
        // selectedWarehouse,
        // setSelectedWarehouse,

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
