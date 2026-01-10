/* eslint-disable */

const express = require("express");
const productsRouter = express.Router();
const productsControllers = require("./products.controllers");

productsRouter.get("/products", async (req, res) => {
  try {
    const { grindType, originCountry } = req.query;

    const products = await productsControllers.getAllProducts({
      grindType,
      originCountry,
    });

    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    const productCreated = await productsControllers.createProduct(product);
    return res.status(201).json(productCreated);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
module.exports = productsRouter;
