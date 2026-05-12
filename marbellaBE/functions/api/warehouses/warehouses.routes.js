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

// Getting cheapest delivery rate depending on warehouse
warehousesRouter.post("/gettingRateFromWarehouse", async (req, res) => {
  try {
    const shipmentInfo = req.body;
    console.log("shipmentInfo:", JSON.stringify(shipmentInfo, null, 2));
    const { shipment } = shipmentInfo;
    const { ship_to, ship_from, packages } = shipment;

    if (!ship_to || !ship_from || !packages?.length) {
      return res.status(400).json({
        error: true,
        message: "Missing ship_to, ship_from, or packages",
      });
    }

    const cheapestRateResponse =
      await warehousesControllers.getCheapestShippingRate(
        ship_to,
        ship_from,
        packages
      );

    const { response, cheapestRate } = cheapestRateResponse || {};
    return res.status(200).json({
      success: true,
      shipment_id: response.data?.shipment_id,
      rate_request_id: response.data?.rate_response?.rate_request_id,

      cheapest_rate: {
        rate_id: cheapestRate.rate_id,
        carrier_id: cheapestRate.carrier_id,
        carrier_code: cheapestRate.carrier_code,
        carrier_name: cheapestRate.carrier_friendly_name,

        service_type: cheapestRate.service_type,
        service_code: cheapestRate.service_code,

        amount: cheapestRate.shipping_amount.amount,
        currency: cheapestRate.shipping_amount.currency,

        delivery_days: cheapestRate.delivery_days,
        estimated_delivery_date: cheapestRate.estimated_delivery_date,
        carrier_delivery_days: cheapestRate.carrier_delivery_days,

        trackable: cheapestRate.trackable,
        guaranteed_service: cheapestRate.guaranteed_service,
      },
    });
    // return res.status(201).json(cheapestRate);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Getting cheapest delivery rate depending on warehouse
warehousesRouter.post("/creatingShippingLabel", async (req, res) => {
  try {
    const { order_id, rate_id } = req.body;

    if (!order_id || !rate_id) {
      return res.status(400).json({
        error: true,
        message: "Missing order_id or rate_id",
      });
    }
    const label = await warehousesControllers.creatingShippingLabel(rate_id);

    // Save this into Firestore order
    const shippingLabel = {
      label_id: label.label_id,
      shipment_id: label.shipment_id,
      tracking_number: label.tracking_number,
      carrier_code: label.carrier_code,
      service_code: label.service_code,
      label_url: label.label_download?.href,
      status: label.status,
      shipment_cost: label.shipment_cost,
      created_at: label.created_at,
    };

    return res.status(201).json(shippingLabel);
  } catch (e) {
    console.log(
      "CREATE SHIPPING LABEL ENDPOINT ERROR:",
      e.response?.data || e.message
    );

    return res.status(500).json({
      error: true,
      message: "Error creating shipping label",
      details: e.response?.data || e.message,
    });
    // return res.status(500).json({ error: e.message });
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
