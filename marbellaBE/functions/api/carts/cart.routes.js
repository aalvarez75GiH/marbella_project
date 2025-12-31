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

cartsRouter.post("/", (req, res) => {
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
  // return res.status(201).json({ status: "Success", user });
  (async () => {
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
  })();
});

cartsRouter.put("/products_cart", async (req, res) => {
  // const user_id = req.query.user_id;
  const user_id = String(req.query.user_id || "").trim();
  const product = req.body;
  // console.log("USER AT END POINT:", user_id);
  // console.log("PRODUCT TO ADD AT END POINT:", product);
  // return res.status(201).json({ status: "Success", user });

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
