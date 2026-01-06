/* eslint-disable */
const firebase_controller = require("../../fb");
const { v4: uuidv4 } = require("uuid");
const {
  buildInventoryFromWarehouseProducts,
  forwardGeocodeAddress,
} = require("./warehouses.handlers");
const key = process.env.GOOGLE_MAPS_API_KEY;
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

// const getWarehouseById = async (warehouse_id) => {
//   try {
//     // Fetch the warehouse by ID from the database or data source
//     const warehouse = warehouses.find(
//       (warehouse) => warehouse.warehouse_id === warehouse_id
//     );

//     // Return the warehouse if found, otherwise return null
//     return warehouse || null;
//   } catch (error) {
//     // Throw an error if something goes wrong
//     throw new Error(`Error fetching warehouse by ID: ${error.message}`);
//   }
// };

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

module.exports = {
  getAllWarehouses,
  getActiveWarehouses,
  createWarehouse,
  getWarehouseById,
};
