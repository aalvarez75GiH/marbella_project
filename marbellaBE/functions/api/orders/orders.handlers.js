/* eslint-disable */

function randomBase36(len) {
  // base36: 0-9a-z
  let out = "";
  while (out.length < len) out += Math.random().toString(36).slice(2);
  return out.slice(0, len).toUpperCase(); // uppercase looks cleaner
}

const makeOrderCode10 = () => {
  // 10 chars total: 6 from timestamp + 4 random
  // timestamp part increases over time => reduces collision chance even more
  const ts = Date.now().toString(36).toUpperCase(); // e.g. "L5GZ2K..."
  const tsPart = ts.slice(-6).padStart(6, "0"); // last 6 chars
  const rndPart = randomBase36(4); // 4 chars random
  return `${tsPart}${rndPart}`; // 10 chars
};

const reserveUniqueOrderNumber = async (
  db,
  { prefix = "MCM", maxRetries = 10 } = {}
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const code10 = makeOrderCode10();
    const orderNumber = `${prefix}-${code10}`;

    try {
      // Use a dedicated collection as a "uniqueness lock"
      // Doc id = orderNumber, so uniqueness is guaranteed by Firestore
      await db.collection("order_numbers").doc(orderNumber).create({
        createdAt: new Date().toISOString(),
      });

      return orderNumber;
    } catch (err) {
      // Collision (doc already exists) => retry
      // Firestore Admin SDK usually throws code 6 for ALREADY_EXISTS
      if (err?.code === 6 || err?.message?.includes("ALREADY_EXISTS")) continue;
      throw err; // real error
    }
  }

  throw new Error(
    "Failed to generate a unique order number after max retries."
  );
};

module.exports = { reserveUniqueOrderNumber };
