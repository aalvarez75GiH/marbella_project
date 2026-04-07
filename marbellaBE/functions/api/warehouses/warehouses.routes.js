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

// Get warehouses by ID
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

warehousesRouter.get("/getAllWarehouses", async (req, res) => {
  try {
    const AllWarehouses = await warehousesControllers.getAllWarehouses();
    if (AllWarehouses.length === 0) {
      return res.status(404).json({ error: "Warehouses not found" });
    }
    return res.status(200).json(AllWarehouses);
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

// Update a existing warehouse
warehousesRouter.put("/updateWarehouse", async (req, res) => {
  const warehouseToUpdate = req.body;
  const warehouse_id = warehouseToUpdate.warehouse_id;
  try {
    if (!warehouse_id) {
      return res.status(400).json({ error: "warehouse_id is required" });
    }
    const warehouseUpdated = await warehousesControllers.updateWarehouse(
      warehouse_id,
      warehouseToUpdate
    );
    return res.status(200).json(warehouseUpdated);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Update warehouse inventory
warehousesRouter.patch("/updateWarehouseInventory", async (req, res) => {
  const warehouse_id = req.query.warehouse_id;
  const inventory = req.body.inventory;
  try {
    const warehouseUpdated =
      await warehousesControllers.updateWarehouseInventory(
        warehouse_id,
        inventory
      );
    return res.status(201).json(warehouseUpdated);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = warehousesRouter;
