/* eslint-disable */

const express = require("express");
const ordersRouter = express.Router();

const ordersControllers = require("./orders.controllers");

ordersRouter.get("/ordersByUserID", async (req, res) => {
  // const user_id = req.query.user_id;
  const user_id = String(req.query.user_id || "").trim();
  try {
    const orders = await ordersControllers.getAllOrdersByUserID(user_id);
    if (!orders) return res.status(404).json({ status: "NotFound", user_id });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ status: "Failed", msg: String(error) });
  }
});
ordersRouter.get("/ordersByUserIDGrouped", async (req, res) => {
  // const user_id = req.query.user_id;
  const user_id = String(req.query.user_id || "").trim();
  try {
    const orders = await ordersControllers.getOrdersGroupedByMonth(user_id);
    if (!orders) return res.status(404).json({ status: "NotFound", user_id });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ status: "Failed", msg: String(error) });
  }
});

ordersRouter.post("/", async (req, res) => {
  const order = req.body;
  const { user_id } = order;
  try {
    const newOrder = await ordersControllers.createOrderWithNoPayment(
      order,
      user_id
    );
    return res.status(201).json(newOrder);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "Failed",
      msg: "Something went wrong saving Data...",
    });
  }
});

module.exports = ordersRouter;
