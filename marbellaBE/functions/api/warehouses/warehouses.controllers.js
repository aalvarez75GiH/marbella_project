/* eslint-disable */
const firebase_controller = require("../../fb");
const { v4: uuidv4 } = require("uuid");
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
  const warehouse_id = warehouse.warehouse_id || uuidv4();

  // ✅ Build inventory from warehouse_products (if provided)
  const computedInventory = buildInventoryFromWarehouseProducts(
    warehouse.warehouse_products || []
  );

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

    // ✅ store inventory map (computed)
    inventory: computedInventory,

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

module.exports = {
  getAllWarehouses,
  getActiveWarehouses,
  createWarehouse,
  getWarehouseById,
  decrementWarehouseInventoryFromOrder,
};
