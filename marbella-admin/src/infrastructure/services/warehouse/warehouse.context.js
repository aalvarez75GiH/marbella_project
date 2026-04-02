import React, {
  useEffect,
  useState,
  createContext,
  useMemo,
  useContext,
} from "react";
import {
  gettingWarehouseByIDRequest,
  gettingAllWarehousesRequest,
} from "./warehouse.services";

import { GlobalContext } from "../global/global.context";
import { GeolocationContext } from "../geolocation/geolocation.context";

export const WarehouseContext = createContext();

export const Warehouse_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myWarehouse, setMyWarehouse] = useState(null);
  const [productsChosenForShop, setProductsChosenForShop] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseSelected, setWarehouseSelected] = useState({
    warehouse_name: "",
    active: true,
    max_delivery_time: 0,
    max_limit_delivery_ratio: 32186.8,
    max_limit_pickup_ratio: 32186.8,
    physical_address: "",
    warehouse_information: {
      representative: "",
      email: "",
      phone: "",
      opening_time: "08:00 AM",
      closing_time: "05:00 PM",
    },
    inventory: {},
  });
  // later you’ll set this based on geolocation
  const { productsCatalog } = useContext(GlobalContext);

  const { deviceLat, deviceLng } = useContext(GeolocationContext);
  // let deviceLat = 36.1060631;
  // let deviceLng = -86.74432890000001;
  // console.log("MY WAREHOUSE CONTEXT AT CONTEXT", myWarehouse);

  useEffect(() => {
    const fetchAllWarehouses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await gettingAllWarehousesRequest();
        setWarehouses(data || []);
      } catch (err) {
        console.error("Error fetching all warehouses:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllWarehouses();
  }, []);

  const makeSku = (productId, variantId) => `${productId}:${variantId}`;

  const getStock = (warehouse, productId, variantId) => {
    const sku = makeSku(productId, variantId);
    return Number(warehouse?.inventory?.[sku] ?? 0);
  };

  // const gettingWarehouseByID = async (warehouse_id) => {
  //   setIsLoading(true);
  //   try {
  //     const warehouse = await gettingWarehouseByIDRequest(warehouse_id);
  //     console.log(
  //       "WAREHOUSE BY ID AT CONTEXT REQUEST FUNCTION:",
  //       JSON.stringify(warehouse, null, 2)
  //     );
  //     setMyWarehouse(warehouse);
  //   } catch (error) {
  //     setError(error);
  //     console.error("Error fetching warehouse by ID:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Admin warehouses functions

  const getWarehouseInventoryProducts = (
    warehouse,
    productsCatalog,
    grindType
  ) => {
    if (!Array.isArray(productsCatalog)) return [];

    return productsCatalog
      .filter((p) => p.grindType === grindType)
      .map((p) => {
        const variantsWithStock = (p.size_variants ?? []).map((v) => ({
          ...v,
          stock: Number(warehouse?.inventory?.[`${p.id}:${v.id}`] ?? 0),
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

  const inventoryProductsGround = useMemo(() => {
    return getWarehouseInventoryProducts(
      warehouseSelected,
      productsCatalog,
      "ground"
    );
  }, [warehouseSelected, productsCatalog]);

  const inventoryProductsWhole = useMemo(() => {
    return getWarehouseInventoryProducts(
      warehouseSelected,
      productsCatalog,
      "whole"
    );
  }, [warehouseSelected, productsCatalog]);

  return (
    <WarehouseContext.Provider
      value={{
        isLoading,
        error,

        makeSku,
        getStock,

        // gettingWarehouseByID,

        warehouses,

        inventoryProductsGround,
        inventoryProductsWhole,

        setWarehouseSelected,
        warehouseSelected,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};
