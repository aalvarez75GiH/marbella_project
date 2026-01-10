/* eslint-disable */

const { v4: uuidv4 } = require("uuid");

const express = require("express");
const usersRouter = express.Router();

const usersControllers = require("./users.controllers");
const cartsControllers = require("../carts/carts.controllers");

usersRouter.get("/userByUID", async (req, res) => {
  try {
    const uid = req.query.uid;
    const users = await usersControllers.getUserByUID(uid);

    if (!users || users.length === 0) {
      return res.status(404).json({ status: "NotFound", uid });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "Failed", msg: String(error) });
  }
});

usersRouter.post("/", async (req, res) => {
  const user_id = uuidv4();
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    address: req.body.address,
    role: req.body.role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    uid: req.body.uid,
    display_name: req.body.display_name,
    user_id,
  };
  try {
    const newUser = await usersControllers.createUser(user);
    if (newUser) {
      const newCart = cartsControllers.createCart({
        user_id: user.user_id,
        cart_id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        products: [],
        sub_total: 0,
        taxes: 0,
        total: 0,
      });
      if (newCart) {
        console.log("Cart created for new user:", newCart);
        return res.status(201).json(newUser);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "Failed",
      msg: "Something went wrong saving Data...",
    });
  }
});

module.exports = usersRouter;
