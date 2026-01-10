/* eslint-disable */

const express = require("express");
const paymentsRouter = express.Router();
// const { v4: uuidv4 } = require("uuid");
// const paymentsControllers = require("./payments.controllers");

paymentsRouter.post("/payments", (req, res) => {
  const data = {
    token: req.body.card_id,
    amount: req.body.totalForStripe,
    name: req.body.nameOnCard,
  };

  console.log("DATA AT END POINT:", data);

  // Validate request body
  if (!data.token || !data.amount || !data.name) {
    return res.status(400).json({
      status: "Failed",
      msg: "Invalid request data. Please provide card_id, totalForStripe, and nameOnCard.",
    });
  }

  // Send response
  res.status(201).json({
    status: "Success",
    data,
  });
});

module.exports = paymentsRouter;
