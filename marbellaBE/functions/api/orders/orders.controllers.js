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

// const getOrdersGroupedByMonth = async (user_id) => {
//   const snap = await firebase_controller.db
//     .collection("orders")
//     .where("user_id", "==", user_id)
//     .get();

//   const buckets = new Map(); // monthKey -> { monthKey, label, orders: [] }

//   snap.forEach((doc) => {
//     const order = doc.data();
//     const createdAtIso = order?.createdAt;

//     if (!createdAtIso) return; // skip if missing

//     const d = new Date(createdAtIso);
//     if (Number.isNaN(d.getTime())) return;

//     const year = d.getFullYear();
//     const monthIndex = d.getMonth(); // 0-11
//     const monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
//     const label = `${MONTHS[monthIndex]}, ${year}`;

//     if (!buckets.has(monthKey)) {
//       buckets.set(monthKey, { monthKey, label, orders: [] });
//     }
//     buckets.get(monthKey).orders.push(order);
//   });

//   // Sort newest month first
//   const grouped = Array.from(buckets.values()).sort((a, b) =>
//     b.monthKey.localeCompare(a.monthKey)
//   );

//   // Optional: sort orders inside each month by newest first
//   grouped.forEach((g) => {
//     g.orders.sort((a, b) =>
//       String(b.createdAt).localeCompare(String(a.createdAt))
//     );
//   });

//   return grouped;
// };
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

module.exports = {
  getOrdersGroupedByMonth,
};

// const createOrder = async (order, user_id) => {
//   console.log("NEW ORDER BEFORE CREATION AT CONTROLLER:", order);
//   const order_id = uuidv4();
//   await firebase_controller.db
//     .collection("orders")
//     .doc(`/${order_id}/`)
//     .create({
//       ...order,
//       order_id: order_id,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     });
//   let orders = [];
//   return await firebase_controller.db
//     .collection("orders")
//     .where(`user_id`, "==", user_id)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         console.log(doc.id, " => ", doc.data());
//         orders.push(doc.data());
//       });
//       console.log("NEW Order:", order);
//       return orders;
//     });
// };

module.exports = {
  createOrder,
  getAllOrdersByUserID,
  createOrderWithNoPayment,
  getOrdersGroupedByMonth,
};
