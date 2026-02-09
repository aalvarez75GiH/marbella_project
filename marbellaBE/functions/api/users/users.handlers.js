/* eslint-disable */
require("dotenv").config();
const crypto = require("crypto");

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
module.exports = {
  normalizePem,
  publicFpFromPem,
  loadPrivateKeyOnce,
};
