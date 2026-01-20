/* eslint-disable */
const axios = require("axios");
const key = process.env.GOOGLE_MAPS_API_KEY;

const buildInventoryFromWarehouseProducts = (warehouse_products = []) => {
  const inventory = {};

  for (const product of warehouse_products) {
    const productId = product?.id;
    if (!productId) continue;

    const variants = Array.isArray(product.size_variants)
      ? product.size_variants
      : [];

    for (const variant of variants) {
      const variantId = String(variant?.id ?? "");
      if (!variantId) continue;

      const qty = Number(variant?.qty ?? 0); // default 0
      const sku = `${productId}:${variantId}`;

      inventory[sku] = qty;
    }
  }

  return inventory;
};

const forwardGeocodeAddress = async (address, key) => {
  if (!address || typeof address !== "string") {
    throw new Error("Geocoding: address is required");
  }

  const { data } = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: { address, key },
      timeout: 10000,
    }
  );

  if (data.status !== "OK" || !data.results?.length) {
    throw new Error(
      `Geocoding failed: ${data.status}${
        data.error_message ? ` - ${data.error_message}` : ""
      }`
    );
  }
  console.log("GEOCODE DATA:", JSON.stringify(data.results[0], null, 2));
  const r = data.results[0];

  return {
    formatted_address: r.formatted_address,
    place_id: r.place_id,
    location_type: r.geometry?.location_type,
    lat: r.geometry?.location?.lat,
    lng: r.geometry?.location?.lng,
    // optional: store raw components if you want county/zip/state later
    address_components: r.address_components,
  };
};

// origin = { lat, lng }
const gettingMostClosestWarehouse = async (allWarehouses, origin) => {
  if (!origin?.lat || !origin?.lng) {
    throw new Error("origin {lat,lng} is required");
  }
  const key = process.env.GOOGLE_MAPS_API_KEY;

  //   const key = process.env.GOOGLE_KEY;
  if (!key) throw new Error("Missing GOOGLE_KEY");

  // ✅ ONLY ACTIVE WAREHOUSES
  //   const activeWarehouses = allWarehouses.filter(
  //     (warehouse) => warehouse?.active === true
  //   );

  // Optional but helpful
  //   if (!activeWarehouses.length) {
  //     return { closest: null, warehouses: [] };
  //   }

  const warehousesWithDistance = await Promise.all(
    allWarehouses.map(async (warehouse) => {
      // ✅ adjust this depending on your stored shape:
      // If you saved geo under warehouse.geo, use that.
      const wLat = warehouse?.geo?.lat ?? warehouse?.geometry?.location?.lat;
      const wLng = warehouse?.geo?.lng ?? warehouse?.geometry?.location?.lng;

      if (typeof wLat !== "number" || typeof wLng !== "number") {
        return {
          ...warehouse,
          distance_error: "Warehouse missing lat/lng",
        };
      }

      const { data } = await axios.get(
        "https://maps.googleapis.com/maps/api/distancematrix/json",
        {
          params: {
            units: "imperial",
            origins: `${origin.lat},${origin.lng}`,
            destinations: `${wLat},${wLng}`,
            key,
          },
          timeout: 10000,
        }
      );

      const element = data?.rows?.[0]?.elements?.[0];

      if (!element || element.status !== "OK") {
        return {
          ...warehouse,
          distance_error:
            element?.status || data?.status || "DistanceMatrix failed",
        };
      }

      return {
        ...warehouse,
        // customer_distance_to_warehouse_meters: element.distance.value, // number
        distance_in_meters: element.distance.value, // number
        distance_in_miles: element.distance.text, // e.g. "4.2 mi"
        distance_time: element.duration.text, // e.g. "11 mins"
      };
    })
  );

  // ✅ keep only valid ones
  const valid = warehousesWithDistance.filter(
    (w) => typeof w.distance_in_meters === "number"
  );

  // If none valid, return what we have
  if (!valid.length) {
    return { closest: null, warehouses: warehousesWithDistance };
  }

  // ✅ find closest
  const closest = valid.reduce((best, cur) =>
    cur.customer_distance_to_warehouse_meters <
    best.customer_distance_to_warehouse_meters
      ? cur
      : best
  );

  return { closest, warehouses: warehousesWithDistance };
};

const gettingRealTimeOrderWHDistanceToOrigin = async (origin, destination) => {
  const lat = origin.lat;
  const lng = origin.lng;
  const wLat = destination.lat;
  const wLng = destination.lng;
  const { data } = await axios.get(
    "https://maps.googleapis.com/maps/api/distancematrix/json",
    {
      params: {
        units: "imperial",
        origins: `${lat},${lng}`,
        destinations: `${wLat},${wLng}`,
        key,
      },
      timeout: 10000,
    }
  );
  const element = data?.rows?.[0]?.elements?.[0];
  if (!element || element.status !== "OK") {
    return {
      ...warehouse,
      distance_error:
        element?.status || data?.status || "DistanceMatrix failed",
    };
  }
  return {
    distance_in_meters: element.distance.value, // number
    distance_in_miles: element.distance.text, // e.g. "4.2 mi"
    distance_time: element.duration.text, // e.g. "11 mins"
  };
};

module.exports = {
  buildInventoryFromWarehouseProducts,
  forwardGeocodeAddress,
  gettingMostClosestWarehouse,
  gettingRealTimeOrderWHDistanceToOrigin,
};
