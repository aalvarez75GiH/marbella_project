/* eslint-disable */

const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");

const express = require("express");
const usersRouter = express.Router();

const usersControllers = require("./users.controllers");
const cartsControllers = require("../carts/carts.controllers");
const productsControllers = require("../products/products.controllers");

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

usersRouter.post("/userByEmail", async (req, res) => {
  const email = req.body?.email?.trim();

  if (!email) {
    return res
      .status(400)
      .json({ status: "BadRequest", msg: "email is required" });
  }

  try {
    const user = await usersControllers.getUserByEmail(email);

    if (!user) return res.status(404).json({ status: "NotFound", email });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "Failed", msg: String(error) });
  }
});

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ status: "Unauthorized" });

    const decoded = await admin.auth().verifyIdToken(token);
    req.auth = decoded; // contains uid
    return next();
  } catch (err) {
    return res.status(401).json({ status: "Unauthorized", msg: String(err) });
  }
}

usersRouter.post("/", requireAuth, async (req, res) => {
  console.log("BODY KEYS:", Object.keys(req.body));
  console.log("CART:", JSON.stringify(req.body.cart, null, 2));
  console.log("CART_PAYLOAD:", JSON.stringify(req.body.cart_payload, null, 2));

  const uidFromToken = req.auth.uid;
  const user_id = uuidv4();
  const cart_payload = req.body.cart_payload; // expecting { products: [...] }

  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    address: req.body.address,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    uid: uidFromToken,
    // uid: req.body.uid,
    display_name: req.body.display_name,
    user_id,
    role: "user",
    encrypted_pin: req.body.encrypted_pin,
  };

  try {
    // 1) Create user
    const newUser = await usersControllers.createUser(user);

    // 2) Normalize cart payload lines
    const incoming = cart_payload?.products ?? [];
    const requested = incoming
      .map((x) => ({
        productId: String(x?.productId ?? "").trim(),
        variantId: String(x?.variantId ?? "").trim(),
        quantity: Math.max(1, Number(x?.quantity ?? 1)),
        image_keys: Array.isArray(x?.image_keys)
          ? x.image_keys.map(String)
          : [],
      }))
      .filter((x) => x.productId && x.variantId && x.quantity > 0);

    // 3) Build cart items + subtotal from DB products
    const cartItems = [];
    let sub_total = 0;

    for (const line of requested) {
      const product = await productsControllers.getProductById(line.productId);
      if (!product) continue;

      const variant = (product.size_variants || []).find(
        (v) => String(v?.id) === line.variantId
      );
      if (!variant) continue;

      const qty = line.quantity;
      const unitPrice = Number(variant?.price ?? 0); // cents

      // Prefer DB keys; fallback to payload keys
      const keysFromDB = Array.isArray(variant?.image_keys)
        ? variant.image_keys
        : [];
      const finalKeys = keysFromDB.length ? keysFromDB : line.image_keys;

      cartItems.push({
        id: product.id,
        title: product.title,
        product_name: product.product_name,
        flag_key: product.flag_key,
        grindType: product.grindType,
        originCountry: product.originCountry ?? "",
        size_variants: [
          {
            ...variant,
            quantity: qty,
            image_keys: finalKeys, // ✅ stored
            // images intentionally omitted (client derives from keys)
          },
        ],
      });

      sub_total += unitPrice * qty;
    }

    // 4) Create cart
    const newCart = await cartsControllers.createCart({
      user_id: user.user_id,
      cart_id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      products: cartItems,
      sub_total,
      taxes: 0,
      total: sub_total,
    });

    return res.status(201).json({ user: newUser, cart: newCart });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).send({
      status: "Failed",
      msg: "Something went wrong saving Data...",
    });
  }
});

// usersRouter.post("/", async (req, res) => {
//   console.log("BODY KEYS:", Object.keys(req.body));
//   console.log("CART:", JSON.stringify(req.body.cart, null, 2));
//   console.log("CART_PAYLOAD:", JSON.stringify(req.body.cart_payload, null, 2));
//   const user_id = uuidv4();
//   const cart_payload = req.body.cart_payload; // expecting { products: [...] }

//   const user = {
//     first_name: req.body.first_name,
//     last_name: req.body.last_name,
//     email: req.body.email,
//     phone_number: req.body.phone_number,
//     address: req.body.address,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     uid: req.body.uid,
//     display_name: req.body.display_name,
//     user_id,
//     role: "user",
//     encrypted_pin: req.body.encrypted_pin,
//   };

//   try {
//     const newUser = await usersControllers.createUser(user);

//     // ✅ pull incoming cart lines safely
//     const incoming = cart_payload?.products ?? [];

//     // ✅ normalize & validate
//     // const requested = incoming
//     //   .map((x) => ({
//     //     productId: String(x.productId || ""),
//     //     variantId: String(x.variantId || ""),
//     //     quantity: Math.max(1, Number(x.quantity || 1)),
//     //   }))
//     //   .filter((x) => x.productId && x.variantId && x.quantity > 0);

//     const requested = incoming
//       .map((x) => ({
//         productId: String(x.productId || ""),
//         variantId: String(x.variantId || ""),
//         quantity: Math.max(1, Number(x.quantity || 1)),
//         image_keys: Array.isArray(x.image_keys) ? x.image_keys.map(String) : [],
//       }))
//       .filter((x) => x.productId && x.variantId && x.quantity > 0);

//     const keysFromDB = Array.isArray(size_variants.image_keys)
//       ? size_variants.image_keys
//       : [];
//     const finalKeys = keysFromDB.length ? keysFromDB : line.image_keys;

//     cartItems.push({
//       ...product,
//       size_variants: [
//         {
//           ...variant,
//           quantity: qty,
//           image_keys: finalKeys, // ✅ store keys
//           images: [], // optional, but you can omit entirely
//         },
//       ],
//     });

//     const cartItems = [];
//     let sub_total = 0;

//     for (const line of requested) {
//       const product = await productsControllers.getProductById(line.productId);
//       if (!product) continue;

//       const variant = (product.size_variants || []).find(
//         (v) => String(v.id) === line.variantId
//       );
//       if (!variant) continue;

//       const unitPrice = Number(variant.price || 0); // cents
//       const qty = line.quantity;

//       cartItems.push({
//         id: product.id,
//         title: product.title,
//         product_name: product.product_name,
//         flag_key: product.flag_key,
//         grindType: product.grindType,
//         size_variants: [
//           {
//             ...variant,
//             quantity: qty,
//             images: Array.isArray(variant.images) ? variant.images : [], // ✅
//           },
//         ],
//         originCountry: product.originCountry ?? "",
//       });

//       sub_total += unitPrice * qty;
//     }

//     const newCart = await cartsControllers.createCart({
//       user_id: user.user_id,
//       cart_id: uuidv4(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       products: cartItems,
//       sub_total, // ✅ correct
//       taxes: 0,
//       total: sub_total,
//     });

//     return res.status(201).json({ user: newUser, cart: newCart });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       status: "Failed",
//       msg: "Something went wrong saving Data...",
//     });
//   }
// });

// usersRouter.post("/", async (req, res) => {
//   const user_id = uuidv4();

//   const user = {
//     first_name: req.body.first_name,
//     last_name: req.body.last_name,
//     email: req.body.email,
//     phone_number: req.body.phone_number,
//     address: req.body.address,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     uid: req.body.uid,
//     display_name: req.body.display_name,
//     encrypted_pin: req.body.encrypted_pin,
//     user_id: user_id,
//     role: "user",
//   };

//   try {
//     const newUser = await usersControllers.createUser(user);
//     if (newUser) {
//       const incoming = req.body?.cart_payload?.products ?? [];

//       // 1) Validate quantities
//       const requested = incoming
//         .map((x) => ({
//           productId: String(x.productId || ""),
//           variantId: String(x.variantId || ""),
//           quantity: Math.max(1, Number(x.quantity || 1)),
//         }))
//         .filter((x) => x.productId && x.variantId && x.quantity > 0);

//       // 2) Look up prices from your products collection (source of truth)
//       const cartItems = [];
//       let sub_total = 0;

//       for (const line of requested) {
//         const product = await productsControllers.getProductById(
//           line.productId
//         );
//         const variant = (product.size_variants || []).find(
//           (v) => String(v.id) === line.variantId
//         );
//         if (!product) continue;

//         if (!variant) continue;

//         const unitPrice = Number(variant.price || 0); // cents
//         const qty = line.quantity;

//         cartItems.push({
//           id: product.id,
//           title: product.title,
//           product_name: product.product_name,
//           flag_key: product.flag_key,
//           grindType: product.grindType,
//           size_variants: [{ ...variant, quantity: qty }],
//         });

//         sub_total += unitPrice * qty;
//       }
//       const newCart = await cartsControllers.createCart({
//         user_id: user.user_id,
//         cart_id: uuidv4(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         products: cartItems,
//         sub_total: 0,
//         taxes: 0,
//         total: sub_total,
//       });
//       if (newCart) {
//         console.log("Cart created for new user:", newCart);
//         return res.status(201).json({
//           user: newUser,
//           cart: newCart,
//         });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       status: "Failed",
//       msg: "Something went wrong saving Data...",
//     });
//   }
// });

module.exports = usersRouter;
