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
  parseUSAddressString,
  buildStripeAddress,
} = require("./payments.handlers");
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

    const emailSent = await sendingEmailToUserWhenOrderIsCreated(createdOrder);
    console.log("Order confirmation email sent:", emailSent.message);

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
// ***************************************************************
// payments.routes.js (or tax.routes.js)

// Helper: normalize a raw address string -> Stripe address object
function normalizeAddressOrThrow(rawAddress) {
  const parsed = parseUSAddressString(rawAddress);
  return buildStripeAddress(parsed);
}

// Helper: build Stripe Tax line items from your Marbella order_products
function buildLineItemsFromOrderProducts(order_products = []) {
  // IMPORTANT:
  // Stripe Tax expects amount = unit amount in cents
  // quantity is required if you want correct totals
  return order_products.flatMap((p) => {
    const productId = p?.id || p?.product_id || p?.title || "item";

    // Your items store quantity at variant-level in size_variants[0].quantity
    const variants = Array.isArray(p?.size_variants) ? p.size_variants : [];

    return variants
      .filter((v) => Number(v?.quantity) > 0)
      .map((v) => {
        const variantId = v?.id || v?.sizeLabel || v?.sizeGrams || "variant";
        const unitAmount = Number(v?.price);

        if (!Number.isInteger(unitAmount)) {
          throw new Error(`Invalid unit price for ${productId}/${variantId}`);
        }

        return {
          amount: unitAmount,
          quantity: Number(v.quantity),
          reference: `${productId}-${variantId}`,
          // ✅ Coffee Beans / Ground Coffee (you can also store this per product)
          tax_code: "txcd_41050006",
        };
      });
  });
}

paymentsRouter.post("/calculatingtaxes", async (req, res) => {
  const order = req.body;
  console.log("TAX QUOTE REQUEST ORDER:", order);
  try {
    if (!order) {
      return res
        .status(400)
        .json({ status: "failed", msg: "order is required" });
    }

    const order_products = order?.order_products || [];
    const pricing = order?.pricing || {};

    // Required addresses:
    const warehouseAddressString =
      order?.warehouse_to_pickup?.warehouse_address ||
      order?.warehouse_to_pickup?.address ||
      order?.warehouse_address;

    if (!warehouseAddressString) {
      return res.status(400).json({
        status: "failed",
        msg: "warehouse address is required (order.warehouse_to_pickup.warehouse_address)",
      });
    }

    // Build line items
    const line_items = buildLineItemsFromOrderProducts(order_products);

    if (!line_items.length) {
      return res.status(400).json({
        status: "failed",
        msg: "No line items found (check order_products size_variants.quantity)",
      });
    }

    // Normalize warehouse address
    const warehouseAddress = normalizeAddressOrThrow(warehouseAddressString);

    // Determine delivery type
    // const finalDeliveryType = delivery_type || order?.delivery_type || "pickup";
    const finalDeliveryType = order?.delivery_type || "pickup";

    // Shipping cost (delivery only)
    const shippingCents =
      finalDeliveryType === "delivery" ? Number(pricing?.shipping || 0) : 0;

    // Destination address
    // pickup -> destination is warehouse (customer comes there)
    // delivery -> destination is customer delivery address
    let customerAddress;

    if (finalDeliveryType === "delivery") {
      const customerAddressString =
        order?.order_delivery_address ||
        order?.customer?.customer_address ||
        order?.customer_address;

      if (!customerAddressString) {
        return res.status(400).json({
          status: "failed",
          msg: "customer delivery address is required for delivery orders (order.order_delivery_address)",
        });
      }

      customerAddress = normalizeAddressOrThrow(customerAddressString);
    } else {
      customerAddress = warehouseAddress;
    }

    // ✅ Build Stripe Tax Calculation payload
    const calculationPayload = {
      currency: "usd",
      customer_details: {
        address: customerAddress,
        // Stripe wants to know what kind of address this is
        // (it’s fine to use "shipping" for pickup too since it’s the "customer location")
        address_source: "shipping",
      },
      line_items,
      expand: ["line_items"],
      //   metadata: {
      //     delivery_type: finalDeliveryType,
      //     order_id: order?.order_number || order?.cart_id || "",
      //   },
    };

    // Include ship_from_details + shipping_cost only for delivery
    if (finalDeliveryType === "delivery") {
      calculationPayload.ship_from_details = { address: warehouseAddress };

      if (Number.isInteger(shippingCents) && shippingCents > 0) {
        calculationPayload.shipping_cost = { amount: shippingCents };
      }
    }
    console.log(
      "LINE ITEMS SENT TO STRIPE:",
      JSON.stringify(line_items, null, 2)
    );
    const calculation = await stripeClient.tax.calculations.create({
      ...calculationPayload,
      expand: ["line_items", "tax_breakdown"],
    });
    console.log("CALC:", JSON.stringify(calculation, null, 2));
    // Stripe returns totals in cents:
    // const tax_amount =
    //   calculation?.tax_amount_exclusive ?? calculation?.tax_amount ?? 0;
    // const total_amount = calculation?.amount_total ?? 0;

    const li = calculation?.line_items?.data || [];
    const shipping = calculation?.shipping_cost || null;

    const items_subtotal = li.reduce(
      (sum, x) => sum + (Number(x.amount) || 0) * (Number(x.quantity) || 0),
      0
    );

    const items_tax = li.reduce(
      (sum, x) => sum + (Number(x.amount_tax) || 0) * (Number(x.quantity) || 0),
      0
    );

    const shipping_amount = shipping?.amount ? Number(shipping.amount) : 0;
    const shipping_tax = shipping?.amount_tax ? Number(shipping.amount_tax) : 0;

    const tax_amount = items_tax + shipping_tax;
    const total_amount = items_subtotal + shipping_amount + tax_amount;

    return res.status(200).json({
      status: "success",
      calculation_id: calculation.id,
      tax_amount,
      total_amount,
      currency: calculation.currency,
      // Optional: helpful during development
      line_items: calculation.line_items || null,
      shipping_cost: calculation.shipping_cost || null,
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

module.exports = { paymentsRouter };

module.exports = paymentsRouter;
