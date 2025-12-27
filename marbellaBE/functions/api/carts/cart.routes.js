/* eslint-disable */

const express = require("express");
const cartsRouter = express.Router();
const { v4: uuidv4 } = require("uuid");
const cartsControllers = require("./carts.controllers");

cartsRouter.get("/", (req, res) => {
  const user_id = req.query.user_id;
  console.log("USER ID AT CARTS ROUTE:", user_id);
  //   res.status(200).send(uid);
  (async () => {
    try {
      const cart = await cartsControllers.getCartByUserUID(user_id);
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
cartsRouter.get("/cart", (req, res) => {
  const user_id = req.query.user_id;
  console.log("USER ID AT CARTS ROUTE:", user_id);
  //   res.status(200).send(uid);
  (async () => {
    try {
      const cart = await cartsControllers.getCartByUserUID(user_id);
      if (cart.length > 0) {
        return res.status(200).json(cart);
      }
      if (cart.length === 0) {
        return res.status(404).json({ status: "NotFound", user_id });
      }
    } catch (error) {
      return res.status(500).send({
        status: "Failed",
        msg: error,
      });
    }
  })();
});

cartsRouter.post("/", (req, res) => {
  const user = {
    user_id: req.body.user_id,
    cart_id: uuidv4(),
    createdAt: new Date().toISOString(),
    products: req.body.products,
    sub_total: req.body.sub_total,
    taxes: req.body.taxes,
    total: req.body.total,
  };
  console.log("USER AT END POINT:", user);
  // return res.status(201).json({ status: "Success", user });
  (async () => {
    try {
      await cartsControllers.createUser(user).then((newCart) => {
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
module.exports = cartsRouter;
