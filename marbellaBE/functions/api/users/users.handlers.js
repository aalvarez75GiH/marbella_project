/* eslint-disable */
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { resetPinCreatedEmail } = require("../emails_templates/pin_reset.email");
const usersControllers = require("./users.controllers");
const path = require("path");
const asset = (file) => path.join(__dirname, "../../assets", file);

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

const sendingEmailToUserPINIsChanged = async (uid, newPin) => {
  // console.log("encrypted_pin at sendingEmailToUser:", encrypted_pin);

  const userToSendEmailTo = await usersControllers.getUserByUID(uid);
  const email = userToSendEmailTo?.email;
  console.log("User email for PIN change notification:", email);

  const to = (email || "").trim().toLowerCase();
  if (!isValidEmail(to)) {
    console.error("Invalid recipient email:", email);
    return null;
  }

  // Optional: quick sanity check; throws on bad auth/connection
  await transporter.verify();

  const preheader =
    "We have set your new PIN. If you didn't request this change, please contact support immediately.";
  // const preheader =
  //   "Thank you for choosing us!. Your order has been received and is being processed.";

  const html = resetPinCreatedEmail({
    preheader,
    userToSendEmailTo,
    newPin,
  });

  const mailOptions = {
    // from: process.env.GMAIL_EMAIL, // must match the authenticated account
    from: "alvarez.arnoldo@gmail.com", // must match the authenticated account
    to,
    // subject: "Your Marbella Cafe order has been received",
    subject: `New Pin set — ${newPin}`,
    text: `This is your pin number set:\n\n${newPin}\n\nIf you didn't set your PIN number, ignore this email.`,

    attachments: [
      {
        filename: "Thanks.png",
        path: asset("Thanks.png"),
        cid: "marbella-thank-you",
      },
      {
        filename: "marbella_cup_of_coffee.jpeg",
        path: asset("marbella_cup_of_coffee.jpeg"),
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
    const info = await transporter.sendMail(mailOptions);
    // console.log("SMTP accepted:", info.accepted);
    // console.log("SMTP rejected:", info.rejected);
    // console.log("MessageID:", info.messageId);
    // console.log("Server response:", info.response);
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
};
