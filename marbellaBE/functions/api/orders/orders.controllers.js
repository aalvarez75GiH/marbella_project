/* eslint-disable */

const firebase_controller = require("../../fb");
const { v4: uuidv4 } = require("uuid");

const { reserveUniqueOrderNumber } = require("./orders.handlers");

const getAllOrdersByUserID = async (user_id) => {
  let orders = [];
  return await firebase_controller.db
    .collection("orders")
    .where(`user_id`, "==", user_id)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        orders.push(doc.data());
      });
      return orders;
    });
};
const createOrder = async (order, user_id, stripe_payment_id) => {
  console.log("NEW ORDER BEFORE CREATION AT CONTROLLER:", order);

  const order_id = uuidv4();

  // ✅ guaranteed-unique order number
  const order_number = await reserveUniqueOrderNumber(firebase_controller.db, {
    prefix: "MCM",
  });

  const newOrder = {
    ...order,
    user_id,
    order_id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stripe_payment_id,
    order_number,
  };

  await firebase_controller.db.collection("orders").doc(order_id).set(newOrder);

  console.log("NEW ORDER CREATED:", newOrder);

  return newOrder;
};

const createOrderWithNoPayment = async (order, user_id) => {
  console.log("NEW ORDER BEFORE CREATION AT CONTROLLER:", order);

  const order_id = uuidv4();

  // ✅ guaranteed-unique order number
  const order_number = await reserveUniqueOrderNumber(firebase_controller.db, {
    prefix: "MCM",
  });

  const newOrder = {
    ...order,
    user_id,
    order_id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order_number,
  };

  await firebase_controller.db.collection("orders").doc(order_id).set(newOrder);

  console.log("NEW ORDER CREATED:", newOrder);

  return newOrder;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getOrdersGroupedByMonth = async (user_id) => {
  const snap = await firebase_controller.db
    .collection("orders")
    .where("user_id", "==", user_id)
    .get();

  const buckets = new Map(); // monthKey -> { monthKey, label, orders: [] }

  snap.forEach((doc) => {
    const order = doc.data();
    const createdAtIso = order?.createdAt;

    if (!createdAtIso) return;

    const d = new Date(createdAtIso);
    if (Number.isNaN(d.getTime())) return;

    const year = d.getFullYear();
    const monthIndex = d.getMonth(); // 0-11
    const monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

    // ✅ SHORT month label
    const label = `${MONTHS[monthIndex].slice(0, 3)}, ${year}`;

    if (!buckets.has(monthKey)) {
      buckets.set(monthKey, { monthKey, label, orders: [] });
    }

    buckets.get(monthKey).orders.push(order);
  });

  // newest month first
  const grouped = Array.from(buckets.values()).sort((a, b) =>
    b.monthKey.localeCompare(a.monthKey)
  );

  // newest orders first within each month
  grouped.forEach((g) => {
    g.orders.sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt))
    );
  });

  return grouped;
};

const markOrderAsRefunded = async (order_id, internal_reason) => {
  const orderRef = firebase_controller.db
    .collection("orders")
    .doc(String(order_id));

  await orderRef.set(
    {
      order_status: "Refunded",
      refund_details: internal_reason,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  const updatedSnap = await orderRef.get();
  return updatedSnap.exists ? updatedSnap.data() : null;
};

const getOrderByPickupToken = async (token) => {
  console.log("Looking up order with pickup token:", token);
  const snap = await firebase_controller.db
    .collection("orders")
    .where("pickup_qr.token", "==", token)
    .limit(1)
    .get();

  const doc = snap.docs[0];
  const order = doc.data();

  await doc.ref.update({
    // "pickup_qr.used": true,
    "pickup_qr.used_at": new Date().toISOString(),
  });

  return order;
};

const updateOrderStatus = async (order_id, order_status) => {
  const orderRef = firebase_controller.db.collection("orders").doc(order_id);

  const docSnap = await orderRef.get();

  if (!docSnap.exists) {
    return null;
  }

  if (order_status === "Finished") {
    await orderRef.update({
      order_status: "Finished",
      updatedAt: new Date().toISOString(),
    });
  }

  if (order_status === "In Progress") {
    await orderRef.update({
      order_status: "In Progress",
      "pickup_qr.used": false,
      "pickup_qr.used_at": null, // optional but recommended
      updatedAt: new Date().toISOString(),
    });
  }

  const updatedSnap = await orderRef.get();

  return updatedSnap.data();
};

module.exports = {
  createOrder,
  getAllOrdersByUserID,
  createOrderWithNoPayment,
  getOrdersGroupedByMonth,
  markOrderAsRefunded,
  getOrderByPickupToken,
  updateOrderStatus,
};
