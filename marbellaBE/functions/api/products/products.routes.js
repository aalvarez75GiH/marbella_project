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
    console.log(
      "PRODUCT RECEIVED AT ENDPOINT:",
      JSON.stringify(product, null, 2)
    );
    const productCreated = await productsControllers.createProduct(product);
    return res.status(201).json(productCreated);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
productsRouter.put("/addSpecs", async (req, res) => {
  const product_id = req.query.id;
  const specs = req.body;
  console.log("PRODUCT ID:", product_id);
  console.log("SPECS RECEIVED AT ENDPOINT:", JSON.stringify(specs, null, 2));

  if (!product_id) {
    return res.status(400).json({ error: "Missing query param: id" });
  }

  if (!specs || typeof specs !== "object") {
    return res.status(400).json({ error: "Body must be a specs object" });
  }

  try {
    const productById = await productsControllers.getProductById(product_id);
    console.log("PRODUCT FETCHED BY ID:", JSON.stringify(productById, null, 2));
    if (!productById) {
      return res.status(404).json({ error: "Product not found" });
    }
    const updatedProduct = await productsControllers.updateProductById(
      product_id,
      {
        specifications: specs.specifications ?? [],
        ingredients: specs.ingredients ?? "",
        additives: specs.additives ?? "",
      }
    );
    return res.status(200).json({
      message: "Specs added successfully to product.",
      product: updatedProduct,
    });
    // return res.status(200).json(updatedProduct);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
module.exports = productsRouter;
