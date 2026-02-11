/* eslint-disable */

const express = require("express");
const cartsRouter = express.Router();
const { v4: uuidv4 } = require("uuid");
const cartsControllers = require("./carts.controllers");
const {
  increaseOrDecreaseCartItemQty,
  removeCartItem,
} = require("./cart.handlers");

cartsRouter.get("/", (req, res) => {
  // const user_id = req.query.user_id;
  const user_id = String(req.query.user_id || "").trim();
  console.log("USER ID AT CARTS ROUTE:", user_id);
  //   res.status(200).send(uid);
  (async () => {
    try {
      const cart = await cartsControllers.getCartByUserID(user_id);
      if (cart) {
        return res.status(200).json(cart);
      }
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

cartsRouter.get("/cart", async (req, res) => {
  // const user_id = req.query.user_id;
  const user_id = String(req.query.user_id || "").trim();
  try {
    const cart = await cartsControllers.getCartByUserID(user_id);
    if (!cart) return res.status(404).json({ status: "NotFound", user_id });
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ status: "Failed", msg: String(error) });
  }
});

cartsRouter.post("/", async (req, res) => {
  const cart = {
    user_id: req.body.user_id,
    cart_id: uuidv4(),
    createdAt: new Date().toISOString(),
    products: req.body.products,
    sub_total: req.body.sub_total,
    taxes: req.body.taxes,
    total: req.body.total,
  };
  console.log("CART AT END POINT:", cart);

  try {
    await cartsControllers.createCart(cart).then((newCart) => {
      res.status(201).json(newCart);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "Failed",
      msg: "Something went wrong saving Data...",
    });
  }
});

cartsRouter.post("/cart/upsert", async (req, res) => {
  const cart = req.body; // ✅ this is the cart
  console.log("CART AT END POINT:", JSON.stringify(cart, null, 2));

  try {
    if (!cart?.user_id) {
      return res.status(400).json({ ok: false, msg: "user_id is required" });
    }

    if (!Array.isArray(cart?.products)) {
      return res.status(400).json({ ok: false, msg: "products[] is required" });
    }

    const savedCart = await cartsControllers.upsertCart(cart);
    return res.status(200).json({ ok: true, cart: savedCart });
  } catch (error) {
    console.log("UPSERT CART ERROR:", error);
    return res.status(500).json({
      ok: false,
      status: "Failed",
      msg: "Something went wrong upserting cart...",
    });
  }
});

cartsRouter.put("/products_cart", async (req, res) => {
  const user_id = String(req.query.user_id || "").trim();
  const product = req.body;

  try {
    const cartUpdated = await cartsControllers.updateProductsCart(
      user_id,
      product
    );

    if (!cartUpdated) {
      return res.status(404).json({ status: "NotFound", user_id });
    }
    return res.status(201).json(cartUpdated);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "Failed",
      msg: "Something went wrong saving Data...",
    });
  }
});

cartsRouter.put("/adjust-qty", async (req, res) => {
  const task = req.query.task; // "increase" or "decrease"
  const user_id = String(req.query.user_id || "").trim();
  console.log("USER ID AT ADJUST QTY ENDPOINT:", user_id);
  console.log("TASK AT ADJUST QTY ENDPOINT:", task);
  try {
    const product = req.body;
    console.log(" PRODUCT TO ADJUST QTY COMING REQ BODY:", product);
    const cart = await increaseOrDecreaseCartItemQty(product, task, user_id);
    res.status(200).json(cart);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

cartsRouter.put("/clear_shopping_cart", async (req, res) => {
  const user_id = String(req.query.user_id || "").trim();
  console.log("USER ID AT ADJUST QTY ENDPOINT:", user_id);
  try {
    const cart = await cartsControllers.resetCartByUserID(user_id);
    res.status(200).json(cart);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

cartsRouter.delete("/item", async (req, res) => {
  const user_id = String(req.query.user_id || "").trim();
  const product_id = String(req.query.product_id || "").trim();
  const variant_id = String(req.query.variant_id || "").trim();

  try {
    const cart = await removeCartItem({ user_id, product_id, variant_id });
    return res.status(200).json(cart);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = cartsRouter;
