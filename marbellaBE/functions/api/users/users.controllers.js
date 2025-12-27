/* eslint-disable */

const firebase_controller = require("../../fb");

const getUserByUID = async (uid) => {
  console.log("UID:", uid);
  let shadowUser = [];
  return await firebase_controller.db
    .collection("users")
    .where(`uid`, "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        shadowUser.push(doc.data());
      });
      console.log("SHADOWUSER:", shadowUser);
      return shadowUser;
    });
};

const createUser = async (user) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    address,
    role,
    createdAt,
    updatedAt,
    uid,
    display_name,
    user_id,
  } = user;
  await firebase_controller.db.collection("users").doc(`/${user_id}/`).create({
    first_name,
    last_name,
    email,
    phone_number,
    address,
    role,
    createdAt,
    updatedAt,
    uid,
    display_name,
    user_id,
  });
  let newUser = [];
  return await firebase_controller.db
    .collection("users")
    .where(`uid`, "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        newUser.push(doc.data());
      });
      console.log("NEW USER:", newUser);
      return newUser;
    });
};

const updateUser = async (data, uid) => {
  const { name, address, phone_number } = data;
  //   let shadowUser = [];
  await firebase_controller.db
    .collection("users")
    .where("uid", "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        doc.ref.update({
          name: name,
          address: address,
          phone_number: phone_number,
        });
        // shadowUser.push(doc.data());
      });
      //   return shadowUser;
    });
  let shadowUser = [];
  return await firebase_controller.db
    .collection("users")
    .where(`uid`, "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        shadowUser.push(doc.data());
      });
      console.log("SHADOWUSER:", shadowUser);
      return shadowUser;
    });
};

module.exports = {
  getUserByUID,
  createUser,
  updateUser,
};
