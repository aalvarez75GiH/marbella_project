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
  const {
    stripe_payment_id: stripe_payment_id,
    order_id,
    reason, // expects Stripe enum OR your app value
    refund_details,
    refunded_by,
    amount, // optional: cents for partial refund
  } = req.body;

  try {
    if (!stripe_payment_id) {
      return res.status(400).json({
        status: "failed",
        msg: "stripe_id (payment_intent_id) is required",
      });
    }
    // Stripe only allows these:
    const ALLOWED_REASONS = new Set([
      "duplicate",
      "fraudulent",
      "requested_by_customer",
    ]);

    // If caller sends a custom reason, keep Stripe reason undefined and store custom in metadata
    const stripeReason = ALLOWED_REASONS.has(reason) ? reason : undefined;
    const internal_reason =
      refund_details || reason || "No internal reason provided";
    const refundedBy = refunded_by || "admin_panel";

    const createParams = {
      payment_intent: stripe_payment_id,
      ...(stripeReason ? { reason: stripeReason } : {}),
      ...(Number.isInteger(amount) ? { amount } : {}), // partial refund support
      metadata: {
        internal_reason,
        order_id: order_id || "",
        refunded_by: refundedBy,
        // helpful for debugging:
        reason_received: reason || "",
      },
    };

    const refund = await stripeClient.refunds.create(createParams);

    // Optional: update order even if refund is pending
    let order_updated = null;
    if (order_id) {
      order_updated = await ordersControllers.markOrderAsRefunded(
        order_id,
        internal_reason
      );
    }

    return res.status(200).json({
      status: "success",
      refund,
      order_updated,
    });
  } catch (error) {
    console.log("ERROR CATCHED:", error);
    return res.status(error?.statusCode || 500).json({
      status: "failed",
      msg: error?.message || "Refund failed",
      code: error?.code || null,
      type: error?.type || null,
    });
  }
});

module.exports = paymentsRouter;
