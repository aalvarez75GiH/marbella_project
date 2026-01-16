/* eslint-disable */

const buildStripeErrorPayload = (error, fallbackMessage) => {
  const stripeErr = error?.raw || error; // Stripe errors often have `.raw`
  return {
    status: "failed",
    message: fallbackMessage || stripeErr?.message || "Payment failed.",
    code: stripeErr?.code || error?.code || null,
    decline_code: stripeErr?.decline_code || error?.decline_code || null,
    type: stripeErr?.type || error?.type || null,
    param: stripeErr?.param || error?.param || null,
    payment_intent:
      stripeErr?.payment_intent?.id || error?.payment_intent?.id || null,
    payment_intent_status:
      stripeErr?.payment_intent?.status ||
      error?.payment_intent?.status ||
      null,
    charge: stripeErr?.charge || error?.charge || null,
    request_id: stripeErr?.requestId || error?.requestId || null,
  };
};

module.exports = {
  buildStripeErrorPayload,
};
