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

  const gettingWarehouseByID = async (warehouse_id) => {
    setIsLoading(true);
    try {
      const warehouse = await gettingWarehouseByIDRequest(warehouse_id);
      console.log(
        "WAREHOUSE BY ID AT CONTEXT REQUEST FUNCTION:",
        JSON.stringify(warehouse, null, 2)
      );
      setMyWarehouse(warehouse);
    } catch (error) {
      setError(error);
      console.error("Error fetching warehouse by ID:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin warehouses functions

  const gettingAllWarehouses = async () => {
    setIsLoading(true);
    try {
      const response = await gettingAllWarehousesRequest();
      return response;
    } catch (error) {
      setError(error);
      console.error("Error fetching all warehouses:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WarehouseContext.Provider
      value={{
        isLoading,
        error,

        makeSku,
        getStock,

        gettingWarehouseByID,

        gettingAllWarehouses,
        warehouses,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};
