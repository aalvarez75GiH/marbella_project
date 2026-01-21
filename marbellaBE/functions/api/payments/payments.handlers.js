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

function parseUSAddressString(addressString) {
  if (!addressString || typeof addressString !== "string") {
    throw new Error("Invalid address string");
  }

  // Example:
  // "2159 W Broad St b, Athens, GA 30606, USA"
  const parts = addressString.split(",").map((p) => p.trim());

  if (parts.length < 3) {
    throw new Error("Address format not supported");
  }

  // Street + optional unit
  const streetPart = parts[0]; // "2159 W Broad St b"
  const city = parts[1]; // "Athens"

  // "GA 30606"
  const stateZipPart = parts[2].split(" ").filter(Boolean);
  const state = stateZipPart[0];
  const postal_code = stateZipPart[1];

  const country = parts[3] || "US";

  // Try to split unit (b, apt, suite, #, etc.)
  let line1 = streetPart;
  let line2;

  const unitMatch = streetPart.match(
    /\b(apt|apartment|suite|ste|unit|#)\s*(\w+)\b/i
  );
  if (unitMatch) {
    line1 = streetPart.replace(unitMatch[0], "").trim();
    line2 = unitMatch[0];
  } else {
    // Handle trailing single-letter units like "b"
    const tokens = streetPart.split(" ");
    if (tokens.length > 2 && tokens[tokens.length - 1].length <= 2) {
      line1 = tokens.slice(0, -1).join(" ");
      line2 = tokens[tokens.length - 1].toUpperCase();
    }
  }

  return {
    line1,
    line2,
    city,
    state,
    postal_code,
    country: country === "USA" ? "US" : country,
  };
}

function buildStripeAddress({
  line1,
  line2,
  city,
  state,
  postal_code,
  country = "US",
}) {
  if (!line1 || !city || !state || !postal_code) {
    throw new Error("Invalid address: missing required fields");
  }

  return {
    line1: String(line1).trim(),
    ...(line2 ? { line2: String(line2).trim() } : {}),
    city: String(city).trim(),
    state: String(state).trim().toUpperCase(),
    postal_code: String(postal_code).trim(),
    country: String(country).trim().toUpperCase(),
  };
}

module.exports = {
  buildStripeErrorPayload,
  parseUSAddressString,
  buildStripeAddress,
};
