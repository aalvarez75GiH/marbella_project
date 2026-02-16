/* eslint-disable */

const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const crypto = require("crypto");

const express = require("express");
const usersRouter = express.Router();

const usersControllers = require("./users.controllers");
const cartsControllers = require("../carts/carts.controllers");
const productsControllers = require("../products/products.controllers");
const { loadPrivateKeyOnce } = require("./users.handlers");

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

usersRouter.post("/credentials", (req, res) => {
  try {
    const keyObject = loadPrivateKeyOnce();

    const { encrypted_pin } = req.body || {};
    if (!encrypted_pin)
      return res.status(400).json({ error: "Missing encryptedPin" });

    const decrypted = crypto.privateDecrypt(
      {
        key: keyObject,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(encrypted_pin, "base64")
    );

    const decrypted_pin = decrypted.toString("utf8");
    console.log("Decrypted PIN:", decrypted_pin);
    // TODO: use `pin` securely (e.g., update Firebase password, or hash & discard)
    return res.json({ ok: true, pin: decrypted_pin }); // ← do NOT send the pin back
  } catch (e) {
    console.error("Decrypt failed:", e);
    return res.status(500).json({ error: "Decrypt failed" });
  }
});

// const { verifyFirebaseToken } = require("../middleware/verifyFirebaseToken");
// middleware/verifyFirebaseToken.js

async function verifyFirebaseToken(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer (.+)$/);

    if (!match) {
      return res.status(401).json({ ok: false, error: "Missing Bearer token" });
    }

    const idToken = match[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    // attach to request for downstream handlers
    req.auth = {
      uid: decoded.uid,
      email: decoded.email || null,
      decoded,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Invalid/expired token" });
  }
}

const router = express.Router();

// PUT /users/pin
usersRouter.put("/new_pin_on_demand", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.auth;
    const { new_pin, new_encrypted_pin } = req.body || {};
    // const user = req.body;
    // const { new_pin, new_encrypted_pin, user_id } = user;

    // 1) Validate PIN
    if (!/^\d{6}$/.test(String(new_pin || ""))) {
      return res.status(400).json({ ok: false, error: "PIN must be 6 digits" });
    }

    // 2) Validate encrypted_pin presence (since you want to keep that design)
    if (
      !new_encrypted_pin ||
      typeof new_encrypted_pin !== "string" ||
      new_encrypted_pin.length < 20
    ) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing/invalid encrypted_pin" });
    }

    // 3) Update Firebase Auth password (PIN)
    await admin.auth().updateUser(uid, { password: String(new_pin) });

    // 4) Update DB (Firestore example)
    // Recommended: store by uid as doc id: users/{uid}

    let encrypted_pin = new_encrypted_pin;
    const result = await usersControllers.updateUser({ encrypted_pin }, uid);
    return res.status(result.status).json({
      ok: result.status === 200,
      message: result.message,
    });

    // const db = admin.firestore();

    // await db.collection("users").doc(uid).set(
    //   {
    //     new_encrypted_pin,
    //     updatedAt: new Date().toISOString(),
    //   },
    //   { merge: true }
    // );

    // return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("PUT /users/pin error:", err);

    // Common Firebase error mapping
    const msg = err?.message || "Server error";

    return res.status(500).json({ ok: false, error: msg });
  }
});

module.exports = usersRouter;
