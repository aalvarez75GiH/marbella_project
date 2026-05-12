/* eslint-disable */

const express = require("express");
const paymentsRouter = express.Router();
const stripeClient = require("stripe")(process.env.STRIPE_KEY);

const {
  sendingEmailToUserWhenOrderIsCreated,
} = require("../orders/orders.handlers");

const ordersControllers = require("../orders/orders.controllers");
const {
  buildStripeErrorPayload,
  buildLineItemsFromOrderProducts,
  normalizeRawAddressIntoStripeAddress,
  generatePickupToken,
} = require("./payments.handlers");
const {
  decrementWarehouseInventoryFromOrder,
} = require("../warehouses/warehouses.controllers");
const { sendOrderStatusPush } = require("../orders/orders.handlers");
const warehousesControllers = require("../warehouses/warehouses.controllers");

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
      // ********************************************************
      const { shipping_rate } = order || {};
      const { rate_id } = shipping_rate || {};
      // const label = await warehousesControllers.creatingShippingLabel(rate_id);

      // const labelResponse = {
      //   label_id: label.label_id,
      //   shipment_id: label.shipment_id,
      //   tracking_number: label.tracking_number,
      //   carrier_code: label.carrier_code,
      //   service_code: label.service_code,
      //   label_url: label.label_download?.href,
      //   status: label.status,
      //   shipment_cost: label.shipment_cost,
      //   created_at: label.created_at,
      // };

      const labelResponseExample = {
        label_id: "se-147174348",
        shipment_id: "se-302806358",
        tracking_number: "1Z2GJ1910320012015",
        carrier_code: "ups",
        service_code: "ups_ground",
        label_url:
          "https://api.shipengine.com/v1/downloads/14/iYxGupUhCEm2oulNrJdPfA/label-147174348.pdf",
        status: "completed",
        shipment_cost: {
          currency: "usd",
          amount: 7.1,
        },
        created_at: "2026-05-11T17:03:37.530773Z",
        rate_id: rate_id,
      };

      // ********************************************************

      await decrementWarehouseInventoryFromOrder({
        warehouse_id,
        order_products: order.order_products,
      });
      const now = new Date().toISOString();
      const pickupToken = generatePickupToken();

      const orderWithPaidStatus = {
        ...order,
        payment_information: {
          ...order.payment_information, // ✅ correct source
          payment_status: "paid",
          paid_at: new Date().toISOString(),
        },
        pickup_qr: {
          token: pickupToken,
          created_at: now,
          expires_at: null,
          used: false,
          used_at: null,
          used_by: null,
        },
        labelResponseExample, // for testing, remove in <production></production>
        //labelResponse, // for testing, remove in <production></production>
      };

      createdOrder = await ordersControllers.createOrder(
        orderWithPaidStatus,
        order.user_id,
        stripe_payment_id
      );
      console.log("ORDER CREATED AT PAYMENTS ROUTE:", createdOrder);
    }

    const emailSent = await sendingEmailToUserWhenOrderIsCreated(createdOrder);
    console.log("Order confirmation email sent:", emailSent.message);

    const dataToReturn = {
      paymentIntentResponse,
      order: createdOrder ?? null,
    };
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
        ok: false,
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

    let pushResult = null;
    if (order_updated) {
      try {
        pushResult = await sendOrderStatusPush({ order: order_updated });
      } catch (pushError) {
        console.log("Refund push send failed:", pushError);
        pushResult = {
          ok: false,
          reason: "push_send_failed",
          error: String(pushError),
        };
      }
    }
    return res.status(200).json({
      ok: true,
      status: "success",
      refund,
      order_updated,
      push: pushResult,
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

paymentsRouter.post("/calculatingtaxes", async (req, res) => {
  try {
    const order = req.body;

    console.log("TAX QUOTE REQUEST ORDER:", JSON.stringify(order, null, 2));

    if (!order) {
      return res.status(400).json({
        status: "failed",
        msg: "order is required",
      });
    }

    const order_products = order?.order_products || [];
    const pricing = order?.pricing || {};

    const warehouseAddressString =
      order?.warehouse_to_pickup?.warehouse_address ||
      order?.warehouse_to_pickup?.address ||
      order?.warehouse_address;

    if (!warehouseAddressString) {
      return res.status(400).json({
        status: "failed",
        msg: "warehouse address is required",
      });
    }

    const line_items = buildLineItemsFromOrderProducts(order_products);

    if (!line_items.length) {
      return res.status(400).json({
        status: "failed",
        msg: "No line items found",
      });
    }

    const warehouseAddress = normalizeRawAddressIntoStripeAddress(
      warehouseAddressString
    );

    const finalDeliveryType = order?.delivery_type || "pickup";

    const shippingCents =
      finalDeliveryType === "delivery" ? Number(pricing?.shipping || 0) : 0;

    let customerAddress;

    if (finalDeliveryType === "delivery") {
      const customerAddressString =
        order?.order_delivery_address ||
        order?.customer?.customer_address ||
        order?.customer_address;

      if (!customerAddressString) {
        return res.status(400).json({
          status: "failed",
          msg: "customer delivery address is required for delivery orders",
        });
      }

      customerAddress = normalizeRawAddressIntoStripeAddress(
        customerAddressString
      );
    } else {
      customerAddress = warehouseAddress;
    }

    const calculationPayload = {
      currency: "usd",
      customer_details: {
        address: customerAddress,
        address_source: "shipping",
      },
      line_items,
      expand: ["line_items", "tax_breakdown"],
    };

    if (finalDeliveryType === "delivery") {
      calculationPayload.ship_from_details = {
        address: warehouseAddress,
      };

      if (Number.isInteger(shippingCents) && shippingCents > 0) {
        calculationPayload.shipping_cost = {
          amount: shippingCents,
        };
      }
    }

    console.log(
      "STRIPE TAX PAYLOAD:",
      JSON.stringify(calculationPayload, null, 2)
    );

    const calculation = await stripeClient.tax.calculations.create(
      calculationPayload
    );

    console.log("STRIPE TAX CALC:", JSON.stringify(calculation, null, 2));

    // IMPORTANT:
    // Do not manually multiply amount_tax by quantity.
    // Stripe already returns final tax totals in cents.
    const tax_amount =
      calculation?.tax_amount_exclusive ?? calculation?.tax_amount ?? 0;

    const total_amount = calculation?.amount_total ?? 0;

    const subtotal_amount =
      calculation?.amount_subtotal ??
      line_items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const shipping_amount = calculation?.shipping_cost?.amount
      ? Number(calculation.shipping_cost.amount)
      : 0;

    const shipping_tax = calculation?.shipping_cost?.amount_tax
      ? Number(calculation.shipping_cost.amount_tax)
      : 0;

    return res.status(200).json({
      status: "success",
      calculation_id: calculation.id,

      tax_amount,
      total_amount,
      subtotal_amount,
      shipping_amount,
      shipping_tax,

      currency: calculation.currency,

      line_items: calculation.line_items || null,
      shipping_cost: calculation.shipping_cost || null,
      tax_breakdown: calculation.tax_breakdown || null,
    });
  } catch (error) {
    console.log("TAX QUOTE ERROR:", {
      message: error?.message,
      type: error?.type,
      code: error?.code,
      raw: error?.raw,
    });

    return res.status(error?.statusCode || 500).json({
      status: "failed",
      msg: error?.message || "Tax quote failed",
      type: error?.type || null,
      code: error?.code || null,
    });
  }
});

module.exports = paymentsRouter;
