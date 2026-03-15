/* eslint-disable */

const express = require("express");
const ordersRouter = express.Router();
const { sendingEmailToUserWhenOrderIsCreated } = require("./orders.handlers");

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
    const emailSent = await sendingEmailToUserWhenOrderIsCreated(newOrder);
    return res.status(201).json(newOrder);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "Failed",
      msg: "Something went wrong saving Data...",
    });
  }
});

//this is just for testing email functionality & email style
ordersRouter.post("/testingEmail", async (req, res) => {
  const order = req.body;
  const { user_id } = order;
  try {
    // const newOrder = await ordersControllers.createOrderWithNoPayment(
    //   order,
    //   user_id
    // );
    const emailSent = await sendingEmailToUserWhenOrderIsCreated(order);
    return res.status(201).json({
      order_id: order.order_id,
      msg: emailSent
        ? emailSent.message
        : "There was an error sending the email...",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "Failed",
      msg: "Something went wrong saving Data...",
    });
  }
});
//this is just for testing email functionality & email style
ordersRouter.post("/order_qr_scanned", async (req, res) => {
  const token = req.body.token;
  console.log("Received order QR scanned with token:", token);
  try {
    const order_to_pickup = await ordersControllers.getOrderByPickupToken(
      token
    );

    const { order_id, pickup_qr } = order_to_pickup || {};
    const { used_at, used } = pickup_qr || {};

    if (used) {
      return res.status(409).json({
        ok: false,
        code: "ORDER_ALREADY_PICKED_UP",
        message: "This order has already been picked up.",
        order_id: order_id,
        used_at: used_at,
      });
    }

    return res.status(201).json({
      order: order_to_pickup,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "Failed",
      msg: "Something went wrong retrieving Data...",
    });
  }
});

ordersRouter.post("/orders_by_customer_qr", async (req, res) => {
  const token = String(req.body.token || "").trim();

  if (!token) {
    return res.status(400).json({
      ok: false,
      code: "MISSING_CUSTOMER_QR_TOKEN",
      message: "Customer QR token is required.",
    });
  }

  try {
    const orders = await ordersControllers.getOrdersByCustomerQrToken(token);

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        ok: false,
        code: "ORDER_NOT_FOUND",
        message: "No order found for this customer QR token.",
      });
    }

    return res.status(200).json({
      ok: true,
      orders,
    });
  } catch (error) {
    console.log("Error retrieving order by customer QR token:", error);
    return res.status(500).json({
      ok: false,
      code: "GET_ORDER_BY_CUSTOMER_QR_FAILED",
      message: "Something went wrong retrieving the order.",
      error: String(error),
    });
  }
});

ordersRouter.patch("/:order_id/status", async (req, res) => {
  const order_id = String(req.params.order_id || "").trim();
  const order_status = String(req.body.order_status || "").trim();

  const allowedStatuses = ["In Progress", "Finished"];

  if (!order_id) {
    return res.status(400).json({
      ok: false,
      code: "MISSING_ORDER_ID",
      message: "order_id is required.",
    });
  }

  if (!allowedStatuses.includes(order_status)) {
    return res.status(400).json({
      ok: false,
      code: "INVALID_ORDER_STATUS",
      message: `order_status must be one of: ${allowedStatuses.join(", ")}`,
    });
  }

  try {
    const updatedOrder = await ordersControllers.updateOrderStatus(
      order_id,
      order_status
    );

    if (!updatedOrder) {
      return res.status(404).json({
        ok: false,
        code: "ORDER_NOT_FOUND",
        message: "Order not found.",
        order_id,
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.log("Error updating order status:", error);
    return res.status(500).json({
      ok: false,
      code: "UPDATE_ORDER_STATUS_FAILED",
      message: "Something went wrong updating the order status.",
      error: String(error),
    });
  }
});

module.exports = ordersRouter;
