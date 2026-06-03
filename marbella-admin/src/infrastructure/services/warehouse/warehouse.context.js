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
  createdWarehouseRequest,
} from "./warehouse.services";

import { GlobalContext } from "../global/global.context";
import { GeolocationContext } from "../geolocation/geolocation.context";

export const WarehouseContext = createContext();

const WAREHOUSE_INITIAL_STATE = {
  warehouse_name: "",
  warehouse_id: "",
  active: true,
  max_delivery_time: 0,
  max_limit_delivery_ratio: 20,
  max_limit_pickup_ratio: 20,
  physical_address: "",
  geo: {},
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
  ship_from: {},
  shipping_information: {
    is_shipping_flat_rate_active: false,
    shipping_flat_rate: 0,
  },
};

export const Warehouse_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseSelected, setWarehouseSelected] = useState(
    WAREHOUSE_INITIAL_STATE
  );
  // const [warehouseSelected, setWarehouseSelected] = useState({
  //   warehouse_name: "",
  //   warehouse_id: "",
  //   active: true,
  //   max_delivery_time: 0,
  //   max_limit_delivery_ratio: 32186.8,
  //   max_limit_pickup_ratio: 32186.8,
  //   physical_address: "",
  //   geo: {},
  //   warehouse_information: {
  //     representative: {
  //       name: "",
  //       email: "",
  //       phone_number: "",
  //     },
  //     email: "",
  //     phone: "",
  //     opening_time: "08:00 AM",
  //     closing_time: "05:00 PM",
  //   },
  //   inventory: {},
  //   ship_from: {},
  //   shipping_information: {
  //     is_shipping_flat_rate_active: false,
  //     shipping_flat_rate: 0,
  //   },
  // });
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

  // Admin warehouses functions

  const buildInventoryProducts = ({
    productsCatalog = [],
    inventoryMap = {},
    grindType,
  }) => {
    if (!Array.isArray(productsCatalog)) return [];

    const roastOrder = {
      light: 1,
      medium: 2,
      dark: 3,
    };

    return productsCatalog
      .filter((p) => {
        const productGrindType = String(p?.grindType || "")
          .trim()
          .toLowerCase();

        const requestedGrindType = String(grindType || "")
          .trim()
          .toLowerCase();

        return productGrindType === requestedGrindType;
      })
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
  const normalizeWarehouseShipFrom = (warehouse) => ({
    ...warehouse,
    ship_from: {
      ...warehouse.ship_from,
      name: warehouse.warehouse_name || warehouse.ship_from?.name || "",
      phone:
        warehouse.warehouse_information?.phone ||
        warehouse.ship_from?.phone ||
        warehouse.warehouse_information?.representative?.phone_number ||
        "",
      company_name: "Cafe Marbella",
    },
  });

  // TODO: createWarehouse and updateWarehouse functions that call the API and update the warehouses state accordingly
  const createWarehouse = async (warehouseToCreate) => {
    // TODO: implement create warehouse function that calls the API and updates the warehouses state
    setIsLoading(true);
    try {
      const normalizedWarehouse = normalizeWarehouseShipFrom(warehouseToCreate);
      const warehouseCreated = await createdWarehouseRequest(
        normalizedWarehouse
      );
      console.log(
        "WAREHOUSE UPDATE RESPONSE:",
        JSON.stringify(warehouseCreated, null, 2)
      );
      if (warehouseCreated && warehouseCreated.warehouse_id) {
        setWarehouseSelected(warehouseCreated);
        setWarehouses((prev) => {
          const exists = prev.some(
            (item) => item.warehouse_id === warehouseCreated.warehouse_id
          );

          if (exists) {
            return prev.map((item) =>
              item.warehouse_id === warehouseCreated.warehouse_id
                ? warehouseCreated
                : item
            );
          }

          return [warehouseCreated, ...prev];
        });
        // setWarehouses((prev) => [warehouseCreated, ...prev]);
        // Optionally update the warehouses list if needed
        return {
          success: true,
          warehouse: warehouseCreated,
          error: null,
        };
      }
      if (!warehouseCreated || !warehouseCreated.warehouse_id) {
        return {
          success: false,
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

  const updateWarehouse = async (warehouseToUpdate) => {
    setIsLoading(true);
    try {
      const normalizedWarehouse = normalizeWarehouseShipFrom(warehouseToUpdate);
      const warehouseUpdated = await updateWarehouseRequest(
        normalizedWarehouse
      );
      console.log(
        "WAREHOUSE UPDATE RESPONSE:",
        JSON.stringify(warehouseUpdated, null, 2)
      );
      if (warehouseUpdated && warehouseUpdated.warehouse_id) {
        setWarehouseSelected(warehouseUpdated);
        setWarehouses((prev) =>
          prev.map((item) =>
            item.warehouse_id === warehouseUpdated.warehouse_id
              ? warehouseUpdated
              : item
          )
        );
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

  const validateWarehouse = () => {
    const w = warehouseSelected;

    if (!w.warehouse_name?.trim()) return "Warehouse name is required";
    if (!w.physical_address?.trim()) return "Warehouse address is required";

    if (!w.warehouse_information?.email?.trim())
      return "Warehouse Email is required";

    if (!w.warehouse_information?.phone?.trim())
      return "Warehouse Phone number is required";

    if (!w.warehouse_information?.opening_time?.trim())
      return "Opening time is required";

    if (!w.warehouse_information?.closing_time?.trim())
      return "Closing time is required";

    const rep = w.warehouse_information?.representative;

    if (!rep?.name?.trim()) return "Representative name is required";

    if (!rep?.email?.trim()) return "Representative email is required";

    if (!rep?.phone_number?.trim()) return "Representative phone is required";

    return null; // ✅ no errors
  };

  const getAddressComponent = (components = [], type, useShortName = false) => {
    const component = components.find((item) => item.types.includes(type));
    return useShortName ? component?.short_name : component?.long_name;
  };

  const buildShipFromFromGooglePlace = ({ details, warehouse }) => {
    const components = details?.address_components || [];

    const streetNumber = getAddressComponent(components, "street_number");
    const route = getAddressComponent(components, "route", true);
    const subpremise = getAddressComponent(components, "subpremise");

    const city =
      getAddressComponent(components, "locality") ||
      getAddressComponent(components, "administrative_area_level_2");

    const state = getAddressComponent(
      components,
      "administrative_area_level_1",
      true
    );

    const postalCode = getAddressComponent(components, "postal_code");
    const country = getAddressComponent(components, "country", true);

    return {
      name: warehouse?.warehouse_name || "Cafe Marbella Warehouse",
      phone: warehouse?.warehouse_information?.phone || "",
      company_name: "Cafe Marbella",

      address_line1: [streetNumber, route].filter(Boolean).join(" "),
      address_line2: subpremise || null,

      city_locality: city,
      state_province: state,
      postal_code: postalCode,
      country_code: country,

      address_residential_indicator: "no",
    };
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
        createWarehouse,
        validateWarehouse,
        buildShipFromFromGooglePlace,
        WAREHOUSE_INITIAL_STATE,
        normalizeWarehouseShipFrom,
        // handleChangeVariantQty,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};
