/* eslint-disable */
const firebase_controller = require("../../fb");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const {
  buildInventoryFromWarehouseProducts,
  forwardGeocodeAddress,
} = require("./warehouses.handlers");
const key = process.env.GOOGLE_MAPS_API_KEY;
const { buildSkuQtyFromOrderProducts } = require("../orders/orders.handlers");
// const warehouses = require("./warehouses.model"); // Assuming you have a model or data source for warehouses

const getWarehouseById = async (warehouse_id) => {
  const snap = await firebase_controller.db
    .collection("warehouses")
    .doc(String(warehouse_id))
    .get();
  return snap.exists ? snap.data() : null;
};

const getAllWarehouses = async () => {
  try {
    const snap = await firebase_controller.db.collection("warehouses").get();
    const warehouses = [];
    snap.forEach((doc) => {
      warehouses.push(doc.data());
    });
    return warehouses;
  } catch (error) {
    throw new Error(`Error fetching all warehouses: ${error.message}`);
  }
};

const getActiveWarehouses = async () => {
  const snap = await firebase_controller.db
    .collection("warehouses")
    .where("active", "==", true)
    .get();

  return snap.docs.map((d) => d.data());
};

const createWarehouse = async (warehouse) => {
  //   if (!warehouse?.warehouse_id) throw new Error("Warehouse missing id");

  const now = new Date().toISOString();

  // 🔑 Generate the ID ONCE
  // const warehouse_id = warehouse.warehouse_id || uuidv4();
  const warehouse_id =
    warehouse.warehouse_id === ""
      ? uuidv4()
      : String(warehouse.warehouse_id || "").trim() || uuidv4();

  // ✅ Build inventory from warehouse_products (if provided)
  // const computedInventory = buildInventoryFromWarehouseProducts(
  //   warehouse.warehouse_products || []
  // );

  // ✅ Build a clean address string (use what you actually store)
  // If warehouse.location is already a string address, use it directly.
  // If it's an object, compose it.
  const fullAddress = warehouse.physical_address;

  // ✅ Forward geocode
  // Use the same key variable you already have in your routes/controllers.
  const geo = await forwardGeocodeAddress(fullAddress, key);

  //   This is the paylodat we will store - warehouse info + geocoding + computed inventory
  const payload = {
    // include only what you want to persist
    warehouse_name: warehouse.warehouse_name,
    physical_address: fullAddress,
    // location: warehouse.location,
    geo: {
      address_input: fullAddress,
      formatted_address: geo.formatted_address,
      place_id: geo.place_id,
      location_type: geo.location_type,
      lat: geo.lat,
      lng: geo.lng,
      // optional, but useful for taxes/county lookups later:
      address_components: geo.address_components,
      updatedAt: now,
    },
    active: Boolean(warehouse.active),
    max_delivery_time: Number(warehouse.max_delivery_time ?? 0),
    max_limit_delivery_ratio: Number(warehouse.max_limit_delivery_ratio ?? 0),
    max_limit_pickup_ratio: Number(warehouse.max_limit_pickup_ratio ?? 0),
    warehouse_information: warehouse.warehouse_information,
    ship_from: warehouse.ship_from ?? null,
    shipping_information: {
      is_shipping_flat_rate_active:
        warehouse.shipping_information?.is_shipping_flat_rate_active ?? false,
      shipping_flat_rate: Number(
        warehouse.shipping_information?.shipping_flat_rate ?? 0
      ),
    },

    // ✅ store inventory map (computed)
    inventory: warehouse.inventory,

    // optional: store products too, if you want (usually not necessary)
    // warehouse_products: warehouse.warehouse_products,

    createdAt: warehouse.createdAt || now,
    updatedAt: now,
    warehouse_id,
  };

  await firebase_controller.db
    .collection("warehouses")
    .doc(String(warehouse_id))
    .set(payload, { merge: false });

  const snap = await firebase_controller.db
    .collection("warehouses")
    .doc(String(warehouse_id))
    .get();

  return snap.data();
};

const decrementWarehouseInventoryFromOrder = async ({
  warehouse_id,
  order_products,
}) => {
  if (!warehouse_id) throw new Error("warehouse_id is required");

  const skuQty = buildSkuQtyFromOrderProducts(order_products);
  const skus = Object.keys(skuQty);

  if (!skus.length) throw new Error("No order items to decrement");

  const whRef = firebase_controller.db
    .collection("warehouses")
    .doc(warehouse_id);

  await firebase_controller.db.runTransaction(async (tx) => {
    const whSnap = await tx.get(whRef);
    if (!whSnap.exists) throw new Error("Warehouse not found");

    const inventory = whSnap.data()?.inventory || {};

    // ✅ final validation (source of truth)
    for (const sku of skus) {
      const current = Number(inventory[sku] ?? 0);
      const qty = Number(skuQty[sku] ?? 0);
      if (current < qty) {
        throw new Error(
          `Out of stock for ${sku}. Have ${current}, need ${qty}`
        );
      }
    }

    // ✅ apply decrements
    const newInventory = { ...inventory };
    for (const sku of skus) {
      newInventory[sku] = Number(newInventory[sku] ?? 0) - Number(skuQty[sku]);
    }

    tx.update(whRef, {
      inventory: newInventory,
      updatedAt: new Date().toISOString(),
    });
  });

  return { ok: true };
};

const updateWarehouseInventory = async (warehouse_id, inventory) => {
  if (!warehouse_id) {
    throw new Error("warehouse_id is required");
  }

  if (!inventory || typeof inventory !== "object" || Array.isArray(inventory)) {
    throw new Error("inventory must be an object map");
  }

  const warehouseRef = firebase_controller.db
    .collection("warehouses")
    .doc(String(warehouse_id));
  const warehouseSnap = await warehouseRef.get();

  if (!warehouseSnap.exists) {
    throw new Error("Warehouse not found");
  }

  // optional: validate every qty is a non-negative number
  const normalizedInventory = {};
  for (const [sku, qty] of Object.entries(inventory)) {
    const numericQty = Number(qty);

    if (!sku || typeof sku !== "string") {
      throw new Error("Invalid SKU key in inventory");
    }

    if (!Number.isFinite(numericQty) || numericQty < 0) {
      throw new Error(`Invalid quantity for SKU ${sku}`);
    }

    normalizedInventory[sku] = numericQty;
  }

  await warehouseRef.update({
    inventory: normalizedInventory,
    updatedAt: new Date().toISOString(),
  });

  const updatedSnap = await warehouseRef.get();

  return updatedSnap.data();
};

const updateWarehouse = async (warehouse_id, warehouse) => {
  if (!warehouse_id) {
    throw new Error("warehouse_id is required");
  }
  const fullAddress = warehouse.physical_address;

  // ✅ Forward geocode
  // Use the same key variable you already have in your routes/controllers.
  const geo = await forwardGeocodeAddress(fullAddress, key);
  const warehouseRef = firebase_controller.db
    .collection("warehouses")
    .doc(warehouse_id);

  const warehouseSnap = await warehouseRef.get();

  if (!warehouseSnap.exists) {
    throw new Error("Warehouse not found");
  }

  const payload = {
    warehouse_name: warehouse.warehouse_name ?? "",
    warehouse_id,
    active: warehouse.active ?? true,
    max_delivery_time: Number(warehouse.max_delivery_time ?? 0),
    max_limit_delivery_ratio: Number(warehouse.max_limit_delivery_ratio ?? 0),
    max_limit_pickup_ratio: Number(warehouse.max_limit_pickup_ratio ?? 0),
    physical_address: warehouse.physical_address ?? "",
    // geo: warehouse.geo ?? null,
    geo: geo ?? null,
    warehouse_information: warehouse.warehouse_information ?? {},
    inventory: warehouse.inventory ?? {},
    updatedAt: new Date().toISOString(),
    ship_from: warehouse.ship_from ?? null,
    shipping_information: {
      is_shipping_flat_rate_active:
        warehouse.shipping_information?.is_shipping_flat_rate_active ?? false,
      shipping_flat_rate: Number(
        warehouse.shipping_information?.shipping_flat_rate ?? 0
      ),
    },
  };

  await warehouseRef.update(payload);

  const updatedSnap = await warehouseRef.get();
  return updatedSnap.data();
};

const SHIPENGINE_API_URL = "https://api.shipengine.com/v1/rates";

const getCheapestShippingRate = async (ship_to, ship_from, packages) => {
  try {
    // const { ship_to, ship_from, packages } = req.body;

    // if (!ship_to || !ship_from || !packages?.length) {
    //   return res.status(400).json({
    //     error: true,
    //     message: "Missing ship_to, ship_from, or packages",
    //   });
    // }

    const payload = {
      rate_options: {
        // carrier_ids: [process.env.SHIPENGINE_UPS_CARRIER_ID],
        carrier_ids: [process.env.SHIPENGINE_UPS_CARRIER_ID],
      },
      shipment: {
        validate_address: "no_validation",
        ship_to,
        ship_from,
        packages,
      },
    };

    const response = await axios.post(SHIPENGINE_API_URL, payload, {
      headers: {
        // "API-Key": process.env.SHIPENGINE_API_KEY,
        "API-Key": process.env.SHIPENGINE_API_KEY,
        "Content-Type": "application/json",
      },
    });

    const rates = response.data?.rate_response?.rates || [];

    if (!rates.length) {
      return res.status(404).json({
        error: true,
        message: "No shipping rates found",
        invalid_rates: response.data?.rate_response?.invalid_rates || [],
      });
    }

    // Optional: only allow UPS Ground
    const allowedRates = rates.filter(
      (rate) => rate.service_code === "ups_ground"
    );

    const ratesToCompare = allowedRates.length ? allowedRates : rates;

    const cheapestRate = ratesToCompare.reduce((cheapest, current) => {
      if (!cheapest) return current;

      return current.shipping_amount.amount < cheapest.shipping_amount.amount
        ? current
        : cheapest;
    }, null);

    return {
      response: response.data,
      cheapestRate,
    };
  } catch (error) {
    console.log("SHIPENGINE RATE ERROR:", error.response?.data || error);

    return res.status(500).json({
      error: true,
      message: "Error getting shipping rates",
      details: error.response?.data || null,
    });
  }
};

module.exports = {
  getAllWarehouses,
  getActiveWarehouses,
  createWarehouse,
  getWarehouseById,
  decrementWarehouseInventoryFromOrder,
  updateWarehouseInventory,
  updateWarehouse,
  getCheapestShippingRate,
};
