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
  updatingWarehouseInventoryRequest,
  updateWarehouseRequest,
} from "./warehouse.services";

import { GlobalContext } from "../global/global.context";
import { GeolocationContext } from "../geolocation/geolocation.context";

export const WarehouseContext = createContext();

export const Warehouse_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseSelected, setWarehouseSelected] = useState({
    warehouse_name: "",
    warehouse_id: "",
    active: true,
    max_delivery_time: 0,
    max_limit_delivery_ratio: 32186.8,
    max_limit_pickup_ratio: 32186.8,
    physical_address: "",
    warehouse_information: {
      representative: {
        name: "",
        email: "",
        phone_number: "",
      },
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

  const getQty = (warehouse, productId, variantId) => {
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

  const buildInventoryProducts = ({
    productsCatalog = [],
    inventoryMap = {},
    grindType,
  }) => {
    if (!Array.isArray(productsCatalog)) return [];

    return productsCatalog
      .filter((p) => p.grindType === grindType)
      .map((p) => {
        const size_variants = (p.size_variants ?? []).map((v) => {
          const qty = Number(inventoryMap[`${p.id}:${v.id}`] ?? 0);

          return {
            ...v,
            qty,
          };
        });

        const totalQty = size_variants.reduce(
          (sum, v) => sum + Number(v.qty ?? 0),
          0
        );

        return {
          ...p,
          size_variants,
          totalQty,
          inStock: totalQty > 0,
        };
      });
  };

  const updateWarehouseInventory = async (warehouse_id, inventory) => {
    setIsLoading(true);
    console.log("WAREHOUSE ID BEFORE GOING TO REQUEST:", warehouse_id);
    try {
      if (!warehouse_id) {
        throw new Error("warehouse_id is required");
      }

      if (
        !inventory ||
        typeof inventory !== "object" ||
        Array.isArray(inventory)
      ) {
        throw new Error("inventory must be an object map");
      }
      const warehouseUpdated = await updatingWarehouseInventoryRequest(
        warehouse_id,
        inventory
      );

      console.log(
        "WAREHOUSE UPDATED RESPONSE:",
        JSON.stringify(warehouseUpdated, null, 2)
      );
      if (warehouseUpdated && warehouseUpdated.warehouse_id) {
        setWarehouseSelected(warehouseUpdated);
        // Optionally update the warehouses list if needed
        return {
          success: true,
          warehouse: warehouseUpdated,
        };
      }
      if (!warehouseUpdated || !warehouseUpdated.warehouse_id) {
        return {
          success: false,
          warehouse: warehouseSelected,
        };
      }
    } catch (error) {
      console.error("Error updating warehouse inventory:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleChangeVariantQty = (productId, variantId, value) => {
  //   const sku = `${productId}:${variantId}`;

  //   setWarehouseSelected((prev) => ({
  //     ...prev,
  //     inventory: {
  //       ...(prev?.inventory || {}),
  //       [sku]: Number(value || 0),
  //     },
  //   }));
  // };

  const createWarehouse = async (warehoseToCreate) => {
    // TODO: implement create warehouse function that calls the API and updates the warehouses state
  };

  const updateWarehouse = async (warehouse) => {
    setIsLoading(true);
    try {
      const warehouseUpdated = await updateWarehouseRequest(warehouse);
      console.log(
        "WAREHOUSE UPDATE RESPONSE:",
        JSON.stringify(warehouseUpdated, null, 2)
      );
      if (warehouseUpdated && warehouseUpdated.warehouse_id) {
        setWarehouseSelected(warehouseUpdated);
        // Optionally update the warehouses list if needed
        return {
          success: true,
          warehouse: warehouseUpdated,
          error: null,
        };
      }
      if (!warehouseUpdated || !warehouseUpdated.warehouse_id) {
        return {
          success: false,
          warehouse: warehouseSelected,
          error: new Error("Failed to update warehouse"),
        };
      }
    } catch (error) {
      console.error("Error updating warehouse:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WarehouseContext.Provider
      value={{
        isLoading,
        error,
        warehouses,
        warehouseSelected,
        productsCatalog,
        setWarehouseSelected,
        getQty,
        makeSku,
        buildInventoryProducts,
        // gettingWarehouseByID,
        updateWarehouseInventory,
        updateWarehouse,

        // handleChangeVariantQty,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};
