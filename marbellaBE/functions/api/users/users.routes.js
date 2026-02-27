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
const {
  sendingEmailToUserPINIsChanged,
  sendingEmailToUserRegistered,
} = require("./users.handlers");

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

async function verifyFirebaseToken(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer (.+)$/);

    if (!match) {
      return res.status(401).json({ ok: false, error: "Missing Bearer token" });
    }

    const idToken = match[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    req.auth = decoded; // ✅ always decoded
    return next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Invalid/expired token" });
  }
}

usersRouter.post("/", verifyFirebaseToken, async (req, res) => {
  console.log("BODY KEYS:", Object.keys(req.body));
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
    // 5) Send email to user created
    await sendingEmailToUserRegistered(newUser[0]);

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

    // 5) create custom token so client can refresh session immediately
    const customToken = await admin.auth().createCustomToken(uid);

    //6) Send email notification to user about PIN change (optional but recommended for security)
    const emailSent = await sendingEmailToUserPINIsChanged(uid, new_pin);
    //7) Return result with new custom token for client to re-auth with new PIN immediately
    return res.status(result.status).json({
      ok: result.status === 200,
      message: result.message,
      customToken: customToken, // send new token so client can re-auth with new PIN immediately
      emailSent: emailSent, // optional: indicate if email notification was sent successfully
    });

    // return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("PUT /users/pin error:", err);

    // Common Firebase error mapping
    const msg = err?.message || "Server error";

    return res.status(500).json({ ok: false, error: msg });
  }
});
usersRouter.put("/update_user_info", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.auth;

    const body = req.body ?? {};
    const patch = {
      first_name: body.first_name ?? "",
      last_name: body.last_name ?? "",
      email: body.email ?? "",
      address: body.address ?? "",
      createdAt: body.createdAt ?? "", // optional: you might want to keep original createdAt instead of updating it
      updatedAt: new Date().toISOString(),
      display_name: body.display_name ?? "",
      phone_number: body.phone_number ?? "",
    };
    // optional hardening: ensure DB email matches Firebase email
    const fbUser = await admin.auth().getUser(uid);
    patch.email = fbUser.email ?? patch.email;

    const result = await usersControllers.updateUser(patch, uid);

    return res.status(result.status).json({
      ok: result.status === 200,
      message: result.message,
      data: result.data ?? null,
    });

    // return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("PUT /users/pin error:", err);

    // Common Firebase error mapping
    const msg = err?.message || "Server error";

    return res.status(500).json({ ok: false, error: msg });
  }
});

module.exports = usersRouter;
