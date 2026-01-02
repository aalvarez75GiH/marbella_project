/* eslint-disable */

const { v4: uuidv4 } = require("uuid");

const express = require("express");
const warehousesControllers = require("./warehouses.controllers");
const warehousesRouter = express.Router();

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

// {
//     "id": "nic-medium-ground",
//     "product_name": "Medium Roast",
//     "product_subtitle": "Ground Bean Nicaragua",
//     "grindType": "ground",
//     "originCountry": "Nicaragua",
//     "title": "Cafe Marbella",
//     "description": "From the volcanic slopes of Nicaragua, our coffee presents a complex profile with notes of cocoa and red fruit.",
//     "rating": 5.0,
//     "flag_key": "nic",
//     "size_variants": [
//         {
//             "id": "250",
//             "sizeLabel": "250 gr",
//             "sizeLabel_ounces": "9 oz",
//             "sizeGrams": 250,
//             "price": 949,
//             "isDefault": true,
//             "image_keys": [
//                 "nicaragua_bag_gb.png",
//                 "marbella_transitory_1.jpeg",
//                 "marbella_transitory_2.png",
//                 "marbella_transitory_3.png"
//             ],
//             "promotion": {
//                 "active": false
//             }
//         },
//         {
//             "id": "500",
//             "sizeLabel": "500 gr",
//             "sizeLabel_ounces": "18 oz",
//             "sizeGrams": 500,
//             "price": 1699,
//             "image_keys": [
//                 "nicaragua_bag_gb.png",
//                 "marbella_transitory_1.jpeg",
//                 "marbella_transitory_2.png",
//                 "marbella_transitory_3.png"
//             ],
//             "promotion": {
//                 "active": false
//             }
//         },
//         {
//             "id": "1000",
//             "sizeLabel": "1000 gr",
//             "sizeLabel_ounces": "36 oz",
//             "sizeGrams": 1000,
//             "price": 3199,
//             "image_keys": [
//                 "nicaragua_bag_gb.png",
//                 "marbella_transitory_1.jpeg",
//                 "marbella_transitory_2.png",
//                 "marbella_transitory_3.png"
//             ],
//             "promotion": {
//                 "active": false
//             }
//         }
//     ],
//     "createdAt": "{{creation_date}}",
//     "updatedAt": "{{creation_date}}"
// }
