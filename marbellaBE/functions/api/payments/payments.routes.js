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
  const nameOnCard = req.body.nameOnCard;

  if (!card_token || !totalForStripe) {
    return res.status(400).json({
      status: "failed",
      message:
        "Invalid request data. Please provide card_id and totalForStripe.",
    });
  }

  const { warehouse_to_pickup } = order || {};
  const warehouse_id = warehouse_to_pickup?.warehouse_id || null;

  let paymentIntentResponse = null;

  // 1. STRIPE PAYMENT ONLY
  try {
    paymentIntentResponse = await stripeClient.paymentIntents.create({
      amount: Number(totalForStripe),
      currency: "usd",
      payment_method_types: ["card"],
      payment_method_data: {
        type: "card",
        card: { token: card_token },
        billing_details: {
          name: nameOnCard || undefined,
        },
      },
      confirm: true,
    });
  } catch (stripeError) {
    console.log("REAL STRIPE PAYMENT ERROR:", {
      message: stripeError?.message,
      code: stripeError?.code,
      decline_code: stripeError?.decline_code,
      type: stripeError?.type,
      raw: stripeError?.raw,
    });

    return res
      .status(stripeError?.statusCode || 402)
      .json(buildStripeErrorPayload(stripeError));
  }

  if (paymentIntentResponse.status !== "succeeded") {
    return res.status(402).json({
      status: "failed",
      message:
        paymentIntentResponse.status === "requires_action"
          ? "This payment requires additional authentication."
          : "Payment was not completed.",
      code: "payment_intent_not_succeeded",
      payment_intent: paymentIntentResponse.id,
      payment_intent_status: paymentIntentResponse.status,
      next_action: paymentIntentResponse.next_action || null,
    });
  }

  // 2. PAYMENT SUCCEEDED — EVERYTHING BELOW IS POST-PAYMENT
  try {
    const stripe_payment_id = paymentIntentResponse.id;
    const now = new Date().toISOString();

    let labelResponse = null;
    let labelResponseExample = null; // for testing, remove in <production></production>
    let labelError = null;

    // 3. CREATE SHIPPING LABEL ONLY FOR DELIVERY
    if (order?.delivery_type === "delivery") {
      try {
        const { shipping_rate } = order || {};
        const { rate_id } = shipping_rate || {};

        if (!rate_id) {
          throw new Error("Missing shipping rate_id for delivery order.");
        }

        // const label = await warehousesControllers.creatingShippingLabel(
        //   rate_id
        // );

        labelResponseExample = {
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

        // labelResponse = {
        //   label_id: label.label_id,
        //   shipment_id: label.shipment_id,
        //   tracking_number: label.tracking_number,
        //   carrier_code: label.carrier_code,
        //   service_code: label.service_code,
        //   label_url: label.label_download?.href,
        //   status: label.status,
        //   shipment_cost: label.shipment_cost,
        //   created_at: label.created_at,
        //   rate_id,
        // };
      } catch (labelErr) {
        console.log("LABEL CREATION FAILED BUT PAYMENT SUCCEEDED:", labelErr);

        labelError = {
          message: labelErr?.message || "Label creation failed",
          code: labelErr?.code || null,
          type: labelErr?.type || null,
        };
      }
    }

    // 4. DECREMENT INVENTORY
    if (!warehouse_id) {
      throw new Error("Missing warehouse_id.");
    }

    await decrementWarehouseInventoryFromOrder({
      warehouse_id,
      order_products: order.order_products,
    });

    // 5. PICKUP QR ONLY FOR PICKUP ORDERS
    const pickupToken =
      order?.delivery_type === "pickup" ? generatePickupToken() : null;

    const orderWithPaidStatus = {
      ...order,

      payment_information: {
        ...order.payment_information,
        payment_status: "paid",
        paid_at: now,
        stripe_order_id: stripe_payment_id,
        transaction_id: stripe_payment_id,
      },

      pickup_qr:
        order?.delivery_type === "pickup"
          ? {
              token: pickupToken,
              created_at: now,
              expires_at: null,
              used: false,
              used_at: null,
              used_by: null,
            }
          : null,

      shipping_label: labelResponseExample,
      shipping_label_error: labelError,

      updatedAt: now,
    };

    // 6. CREATE ORDER
    const createdOrder = await ordersControllers.createOrder(
      orderWithPaidStatus,
      order.user_id,
      stripe_payment_id
    );

    console.log("ORDER CREATED AT PAYMENTS ROUTE:", createdOrder);

    // 7. SEND EMAIL, BUT DO NOT FAIL PAYMENT/ORDER IF EMAIL FAILS
    try {
      const emailSent = await sendingEmailToUserWhenOrderIsCreated(
        createdOrder
      );
      console.log("Order confirmation email sent:", emailSent?.message);
    } catch (emailError) {
      console.log("EMAIL FAILED BUT PAYMENT/ORDER SUCCEEDED:", emailError);
    }

    return res.status(200).json({
      status: "success",
      paymentIntentResponse,
      order: createdOrder,
    });
  } catch (postPaymentError) {
    console.log("POST PAYMENT ERROR:", postPaymentError);

    return res.status(500).json({
      status: "payment_succeeded_order_failed",
      message:
        "Payment succeeded, but there was a problem creating the order. Please contact support.",
      payment_intent: paymentIntentResponse.id,
      payment_intent_status: paymentIntentResponse.status,
      error: postPaymentError?.message || String(postPaymentError),
    });
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
