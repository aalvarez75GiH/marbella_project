/* eslint-disable */

const firebase_controller = require("../../fb");

const getCartByUserUID = async (user_id) => {
  let carts = [];
  return await firebase_controller.db
    .collection("carts")
    .where(`user_id`, "==", user_id)
    .get()
    // .then((orders) => orders.data());
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        carts.push(doc.data());
      });
      return carts;
    });
};

const createCart = async (cart) => {
  const {
    user_id,
    cart_id,
    createdAt,
    updatedAt,
    products,
    sub_total,
    taxes,
    total,
  } = cart;
  await firebase_controller.db.collection("carts").doc(user_id).create({
    user_id,
    cart_id,
    createdAt,
    updatedAt,
    products,
    sub_total,
    taxes,
    total,
  });
  let newCart = [];
  return await firebase_controller.db
    .collection("carts")
    .where(`cart_id`, "==", cart_id)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        newCart.push(doc.data());
      });
      console.log("NEW USER:", newCart);
      return newCart;
    });
};

module.exports = {
  getCartByUserUID,
  createCart,
};
