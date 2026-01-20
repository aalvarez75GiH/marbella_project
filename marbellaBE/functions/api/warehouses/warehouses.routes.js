/* eslint-disable */

const url = require("url");
const axios = require("axios");

const key = process.env.GOOGLE_MAPS_API_KEY;
const express = require("express");
const warehousesControllers = require("./warehouses.controllers");
const warehousesRouter = express.Router();
const {
  gettingMostClosestWarehouse,
  gettingRealTimeOrderWHDistanceToOrigin,
} = require("./warehouses.handlers");

// Get all warehouses
warehousesRouter.get("/getWarehouse", async (req, res) => {
  try {
    const warehouse_id = req.query.warehouse_id;
    const warehouse = await warehousesControllers.getWarehouseById(
      warehouse_id
    );
    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    return res.status(200).json(warehouse);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Determine nearest warehose from device location
warehousesRouter.get("/closestWH", async (req, res) => {
  // console.log("PASA AL MENOS X AQUI");
  // (async () => {
  const { lat, lng } = url.parse(req.url, true).query;
  const origin = {
    lat: lat,
    lng: lng,
  };
  console.log("ORIGIN:", JSON.stringify(origin, null, 2));
  let warehouses = [];
  try {
    // const allWarehouses = await warehousesControllers.getAllWarehouses();
    const allWarehouses = await warehousesControllers.getActiveWarehouses();
    const closestWarehouse = await gettingMostClosestWarehouse(
      allWarehouses,
      origin
    );
    console.log("CLOSEST WAREHOUSE:", closestWarehouse);
    return res.status(200).json(closestWarehouse);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "Failed",
      msg: "Something went wrong saving Data...",
    });
  }
  // })();
});
// Determine nearest warehose from device location
warehousesRouter.get("/realTimeSpecificWHDistance", async (req, res) => {
  const { lat, lng, wLat, wLng } = req.query; // simpler than url.parse

  const oLat = parseFloat(lat);
  const oLng = parseFloat(lng);
  const dLat = parseFloat(wLat);
  const dLng = parseFloat(wLng);

  if (![oLat, oLng, dLat, dLng].every(Number.isFinite)) {
    return res.status(400).json({
      status: "Failed",
      msg: "lat,lng,wLat,wLng must be valid numbers",
      received: { lat, lng, wLat, wLng },
    });
  }
  const origin = { lat: oLat, lng: oLng };
  const destination = { lat: dLat, lng: dLng };
  //   const { wLat, wLng } = req.body;

  console.log("ORIGIN:", JSON.stringify(origin, null, 2));
  console.log("DESTINATION:", JSON.stringify(destination, null, 2));
  try {
    const response = await gettingRealTimeOrderWHDistanceToOrigin(
      origin,
      destination
    );
    // const allWarehouses = await warehousesControllers.getAllWarehouses();
    console.log("REAL TIME DISTANCE:", response);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "Failed",
      msg: "Something went wrong saving Data...",
    });
  }
});
// Create a new warehouse
warehousesRouter.post("/createWarehouse", async (req, res) => {
  try {
    const warehouse = req.body;
    const warehouseCreated = await warehousesControllers.createWarehouse(
      warehouse
    );
    return res.status(201).json(warehouseCreated);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = warehousesRouter;

// // Geocoding endpoint
// warehousesRouter.get("/geocoding", async (req, res) => {
//   //   (async () => {
//   const { lat, lng } = req.query;
//   console.log("Lat:", lat, "Lng:", lng);

//   var config = {
//     method: "get",
//     // url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=street_address&key=${process.env.GOOGLE_KEY}`,
//     url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=street_address&key=${key}`,
//     headers: {},
//   };

//   await axios(config)
//     .then((responseFromGoogle) => {
//       res.json(responseFromGoogle.data.results[0]);
//     })
//     .catch((error) => {
//       console.log("ERROR:", error);
//     });
//   //   })();
// });

// // Forward geocoding: address -> lat/lng
// warehousesRouter.get("/geocode-address", async (req, res) => {
//   try {
//     const { address } = req.query;

//     if (!address) {
//       return res.status(400).json({ error: "Address is required" });
//     }

//     const response = await axios.get(
//       "https://maps.googleapis.com/maps/api/geocode/json",
//       {
//         params: {
//           address,
//           key,
//         },
//       }
//     );

//     if (response.data.status !== "OK") {
//       return res.status(400).json({
//         error: response.data.status,
//         details: response.data.error_message,
//       });
//     }

//     const result = response.data.results[0];

//     res.json({
//       formatted_address: result.formatted_address,
//       lat: result.geometry.location.lat,
//       lng: result.geometry.location.lng,
//       place_id: result.place_id,
//       location_type: result.geometry.location_type,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Geocoding failed" });
//   }
// });
