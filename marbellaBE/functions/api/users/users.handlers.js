/* eslint-disable */
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const {
  registeredUserCreatedEmail,
} = require("../emails_templates/register_user_email");

const { resetPinCreatedEmail } = require("../emails_templates/pin_reset.email");
const usersControllers = require("./users.controllers");
const path = require("path");
// const asset = (file) => path.join(__dirname, "../../assets", file);
const asset = (filename) =>
  path.join(__dirname, "..", "..", "assets", filename);
console.log("ASSET PATHS", {
  banner: asset("Reset_PIN_Email_banner.png"),
  hero: asset("marbella_hands_beans.jpg"),
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // user: process.env.GMAIL_EMAIL, // e.g., "alvarez.arnoldo@gmail.com"
    user: "alvarez.arnoldo@gmail.com", // e.g., "alvarez.arnoldo@gmail.com"
    // pass: process.env.GMAIL_APP_PASSWORD, // 16-char app password
    pass: "ubfiljheujsrwhsy", // 16-char app password
  },
  logger: true, // optional: helpful during debugging
  debug: true, // optional
});

const normalizePem = (pemMaybe) => {
  if (!pemMaybe) return "";
  return pemMaybe
    .replace(/\\n/g, "\n") // unescape \n from .env
    .replace(/\r\n?/g, "\n") // normalize CRLF/CR
    .replace(/^\uFEFF/, "") // strip BOM
    .trim()
    .replace(/^['"]|['"]$/g, ""); // strip surrounding quotes if present
};
let keyObject;
let selfTestDone = false;

const publicFpFromPem = (pem) => {
  try {
    const header = (pem.split("\n")[0] || "").trim();
    if (header.includes("BEGIN PUBLIC KEY")) {
      const pub = crypto.createPublicKey({
        key: pem,
        format: "pem",
        type: "spki",
      });
      return crypto
        .createHash("sha256")
        .update(pub.export({ type: "spki", format: "pem" }))
        .digest("hex");
    }
    if (
      header.includes("BEGIN PRIVATE KEY") ||
      header.includes("BEGIN RSA PRIVATE KEY")
    ) {
      const type = header.includes("RSA PRIVATE KEY") ? "pkcs1" : "pkcs8";
      const priv = crypto.createPrivateKey({ key: pem, format: "pem", type });
      const pub = crypto.createPublicKey(priv);
      return crypto
        .createHash("sha256")
        .update(pub.export({ type: "spki", format: "pem" }))
        .digest("hex");
    }
  } catch (e) {
    console.error("Public key fingerprint error:", e);
  }
  return null;
};

const loadPrivateKeyOnce = () => {
  if (keyObject) return keyObject;

  const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";
  const pemLocal = normalizePem(process.env.SERVER_PRIVATE_KEY_PEM || "");
  const pemSecret = normalizePem(process.env.SERVER_PRIVATE_KEY_PEM || "");

  // choose ONE source
  const chosenPem = isEmulator ? pemLocal : pemSecret;
  if (!chosenPem) {
    throw new Error(
      isEmulator
        ? "Missing PRIVATE_KEY_PEM in .env (dev)"
        : "Missing RSA_PRIVATE_KEY in Secret Manager (prod)"
    );
  }

  // if both exist (e.g., in dev), only warn on true key mismatch
  if (pemLocal && pemSecret) {
    const fLocal = publicFpFromPem(pemLocal);
    const fSecret = publicFpFromPem(pemSecret);
    if (fLocal && fSecret && fLocal !== fSecret) {
      console.warn(
        "Public key mismatch between .env and Secret Manager; using",
        isEmulator ? ".env" : "Secret Manager"
      );
    }
  }

  const header = (chosenPem.split("\n")[0] || "").trim();
  const type = header.includes("RSA PRIVATE KEY") ? "pkcs1" : "pkcs8";
  keyObject = crypto.createPrivateKey({ key: chosenPem, format: "pem", type });
  return keyObject;
};

const isValidEmail = (s) =>
  typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

/**
 * Send “PIN changed” email.
 * - Never throws (so your endpoint won’t 500 after DB/Firebase already updated)
 * - Normalizes user payload (array vs object)
 * - Avoids per-request transporter.verify()
 * - Avoids envelope.from being undefined
 */
async function sendingEmailToUserPINIsChanged(uid, newPin) {
  try {
    // 1) Load user
    const raw = await usersControllers.getUserByUID(uid);
    const user = Array.isArray(raw) ? raw[0] : raw;

    const to = (user?.email || "").trim().toLowerCase();
    if (!isValidEmail(to)) {
      console.log("PIN email: invalid/missing user email for uid:", uid, to);
      return { ok: false, error: "Invalid/missing recipient email" };
    }

    // 2) Build email
    const FROM = (
      process.env.GMAIL_EMAIL || "alvarez.arnoldo@gmail.com"
    ).trim();

    const preheader =
      "We have set your new PIN. If you didn't request this change, please contact support immediately.";

    const html = resetPinCreatedEmail({
      preheader,
      userToSendEmailTo: user,
      newPin,
    });

    const mailOptions = {
      from: FROM,
      to,
      subject: "New PIN number set for your Café Marbella account",
      text: `Your new PIN is:\n\n${newPin}\n\nIf you didn't request this change, please contact support.`,
      attachments: [
        {
          filename: "Reset_PIN_Email_banner.png",
          path: asset("Reset_PIN_Email_banner.png"),
          cid: "marbella-reset-pin",
        },
        {
          filename: "marbella_hands_beans.jpg",
          path: asset("marbella_hands_beans.jpg"),
          cid: "marbella-hero",
        },
      ],
      html,
      headers: { "X-Entity-Ref-ID": `marbella-${Date.now()}` },
      // ✅ no envelope (avoids undefined-from issues)
    };

    // 3) Send
    await transporter.sendMail(mailOptions);
    return { ok: true };
  } catch (err) {
    console.log("PIN email failed (non-fatal):", err?.message ?? err);
    return { ok: false, error: err?.message || String(err) };
  }
}

const sendingEmailToUserRegistered = async (newUser) => {
  // console.log("encrypted_pin at sendingEmailToUser:", encrypted_pin);
  console.log(
    "NEW USER AT SENDING EMAIL HANDLER: ",
    JSON.stringify(newUser, null, 2)
  );
  const email = newUser.email;
  const display_name =
    newUser.display_name || `${newUser.first_name} ${newUser.last_name}`;
  const encrypted_pin = newUser.encrypted_pin;

  console.log("User email for registered user notification:", email);

  const to = (email || "").trim().toLowerCase();
  if (!isValidEmail(to)) {
    console.error("Invalid recipient email:", email);
    return null;
  }

  // Optional: quick sanity check; throws on bad auth/connection
  await transporter.verify();

  const preheader =
    "We have registered your account. If you didn't request this registration, please contact support immediately.";

  // Decrypt the PIN using the loaded private key in order to show it at email
  const keyObject = loadPrivateKeyOnce();
  if (!keyObject) {
    throw new Error("Server RSA private key not configured.");
  }

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

  const html = registeredUserCreatedEmail({
    preheader,
    display_name,
    decrypted_pin,
  });

  const mailOptions = {
    // from: process.env.GMAIL_EMAIL, // must match the authenticated account
    from: "alvarez.arnoldo@gmail.com", // must match the authenticated account
    to,
    // subject: "Your Marbella Cafe order has been received",
    subject: `Your new Marbella Cafe account`,
    // text: `This is your pin number set:\n\n${newPin}\n\nIf you didn't set your PIN number, ignore this email.`,

    attachments: [
      {
        filename: "Register_user_thanks.png",
        path: asset("Register_user_thanks.png"),
        cid: "marbella-register-user",
      },
      {
        filename: "marbella_team.jpeg",
        path: asset("marbella_team.jpeg"),
        cid: "marbella-hero",
      },
    ],
    html,

    // (Optional) Make the SMTP envelope explicit; usually not needed, but can help:
    envelope: {
      from: process.env.GMAIL_EMAIL,
      to: to,
    },
    headers: { "X-Entity-Ref-ID": `marbella-${Date.now()}` },
  };

  try {
    await transporter.sendMail(mailOptions);

    return {
      ok: true,
      message: "Email sent successfully...",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
module.exports = {
  normalizePem,
  publicFpFromPem,
  loadPrivateKeyOnce,
  sendingEmailToUserPINIsChanged,
  sendingEmailToUserRegistered,
};
