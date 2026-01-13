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
};
