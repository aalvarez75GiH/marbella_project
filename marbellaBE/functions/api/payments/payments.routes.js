/* eslint-disable */

const express = require("express");
const paymentsRouter = express.Router();
const stripeClient = require("stripe")(process.env.STRIPE_KEY);

const ordersControllers = require("../orders/orders.controllers");
const { buildStripeErrorPayload } = require("./payments.handlers");
const {
  decrementWarehouseInventoryFromOrder,
} = require("../warehouses/warehouses.controllers");
// const { v4: uuidv4 } = require("uuid");
// const paymentsControllers = require("./payments.controllers");

paymentsRouter.post("/payments", async (req, res) => {
  const totalForStripe = req.body.totalForStripe;
  const card_token = req.body.card_id;
  const order = req.body.order;
  let createdOrder = null;
  console.log("CUSTOMER ORDER AT PAYMENTS ROUTE:", order);
  const { warehouse_to_pickup } = order || {};
  const warehouse_id = warehouse_to_pickup?.warehouse_id || null;

  const data = {
    token: req.body.card_id,
    amount: req.body.totalForStripe,
    name: req.body.nameOnCard,
  };

  // Validate request body
  if (!data.token || !data.amount || !data.name) {
    return res.status(400).json({
      status: "Failed",
      msg: "Invalid request data. Please provide card_id, totalForStripe, and nameOnCard.",
    });
  }

  try {
    const paymentIntentResponse = await stripeClient.paymentIntents.create({
      amount: Number(totalForStripe), // cents
      currency: "usd",
      payment_method_types: ["card"],
      payment_method_data: {
        type: "card",
        card: { token: card_token }, // see note below
      },
      confirm: true,
    });

    if (paymentIntentResponse.status !== "succeeded") {
      // treat as a payment failure / needs action
      return res.status(402).json({
        status: "failed",
        message:
          paymentIntentResponse.status === "requires_action"
            ? "This payment requires additional authentication."
            : "Payment was not completed. Please try another card.",
        code: "payment_intent_not_succeeded",
        payment_intent: paymentIntentResponse.id,
        payment_intent_status: paymentIntentResponse.status,
        next_action: paymentIntentResponse.next_action || null,
      });
    }

    let stripe_payment_id = paymentIntentResponse.id;
    if (paymentIntentResponse.status === "succeeded" && order) {
      console.log(
        "paymentIntentResponse STATUS:",
        paymentIntentResponse.status
      );
      console.log("Payment succeeded, creating order...");

      await decrementWarehouseInventoryFromOrder({
        warehouse_id,
        order_products: order.order_products,
      });

      const orderWithPaidStatus = {
        ...order,
        payment_information: {
          ...order.payment_information, // ✅ correct source
          payment_status: "paid",
          paid_at: new Date().toISOString(),
        },
      };

      createdOrder = await ordersControllers.createOrder(
        orderWithPaidStatus,
        order.user_id,
        stripe_payment_id
      );
      console.log("ORDER CREATED AT PAYMENTS ROUTE:", createdOrder);
    }

    const dataToReturn = {
      paymentIntentResponse,
      order: createdOrder ?? null,
    };
    //   console.log(paymentIntentResponse);
    // res.json(paymentIntentResponse);
    res.json(dataToReturn);
    return;
  } catch (error) {
    console.log("STRIPE ERROR:", {
      message: error?.message,
      code: error?.code,
      decline_code: error?.decline_code,
      type: error?.type,
      rawType: error?.raw?.type,
    });
    // Default message (safe)
    let msg = "Your card was declined. Please try another card.";
    let httpStatus = 402; // Payment Required (common for card declines)

    // Specific codes
    if (error.code === "incorrect_cvc") {
      msg = "The CVC number is incorrect. Please check it and try again.";
    } else if (
      error.code === "incorrect_number" ||
      error.code === "invalid_number"
    ) {
      msg = "The card number is invalid. Please check it and try again.";
    } else if (error.code === "expired_card") {
      msg = "This card is expired. Please use a different card.";
    } else if (error.code === "processing_error") {
      msg = "There was a processing error. Please try again.";
    }

    // decline_code-based messaging
    if (error.decline_code === "insufficient_funds") {
      msg = "Insufficient funds. Please use another card.";
    } else if (error.decline_code === "lost_card") {
      msg = "This card has been reported lost. Please use a different card.";
    } else if (error.decline_code === "generic_decline") {
      msg =
        "Your card was declined. Please contact your bank or try another card.";
    }

    // If it’s NOT a card decline, use 400/500 appropriately
    // (Example: bad parameters, Stripe misconfiguration, etc.)
    if (error.type && error.type !== "StripeCardError") {
      httpStatus = 400; // most non-card Stripe errors are request issues
      msg = "Payment could not be processed due to a configuration error.";
    }

    return res.status(httpStatus).json(buildStripeErrorPayload(error, msg));
  }
});
paymentsRouter.post("/refundOrder", async (req, res) => {
  const payment_intent_id = req.query.stripe_id;
  const order_id = req.query.order_id;
  const reason = req.body.reason || "No reason provided";
  const refunded_by = req.body.refunded_by || "admin_panel";
  const internal_reason =
    req.body.internal_reason || "No internal reason provided";
  console.log("PAYMENT INTENT ID:", payment_intent_id);
  console.log("ORDER ID", order_id);
  console.log("REASON:", reason);

  try {
    // const refundIntentResponse = await stripeClient.refunds.create({
    //   payment_intent: payment_intent_id,
    //   reason: reason,
    // });
    const refundIntentResponse = await stripeClient.refunds.create({
      payment_intent: payment_intent_id,
      reason: "requested_by_customer",
      metadata: {
        internal_reason: internal_reason,
        order_id: order_id,
        refunded_by: refunded_by,
      },
    });
    console.log(
      "REFUND RESPONSE FROM STRIPE:",
      JSON.stringify(refundIntentResponse, null, 2)
    );
    if (refundIntentResponse.status !== "succeeded") {
      return res.status(500).json({
        status: "failed",
        msg: `Refund for payment_intent_id: ${payment_intent_id} could not be processed.`,
        refund_intent_status: refundIntentResponse.status,
      });
    }
    // await ordersControllers.markOrderAsRefunded(
    //   order_id,
    //   payment_intent_id,
    //   reason
    // );

    res.json({
      status: "success",
      msg: `Refund processed for payment_intent_id: ${payment_intent_id}, order_id: ${order_id}`,
    });
    return;
  } catch (error) {
    console.log("ERROR CATCHED:", error);
    // if (error.code === "incorrect_cvc") {
    //   res
    //     .status(402)
    //     .send(
    //       "We're sorry, it looks like your cvc number is not correct, try again.. "
    //     );
    // }
    // if (error.code === "incorrect_number") {
    //   res
    //     .status(402)
    //     .send("Sorry, Your card number is invalid, try again... ");
    // }
  }
});

module.exports = paymentsRouter;
