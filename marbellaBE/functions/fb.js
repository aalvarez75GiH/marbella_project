/* eslint-disable */
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

function initAdmin() {
  if (admin.apps.length) return;

  // 1️⃣ If running locally and file exists → use serviceAccountKey.json
  const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("🔥 Firebase Admin initialized with serviceAccountKey.json");
    return;
  }

  // 2️⃣ If using env var JSON (optional)
  const json = process.env.SERVICE_ACCOUNT_JSON;
  if (json) {
    const serviceAccount = JSON.parse(json);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("🔥 Firebase Admin initialized with SERVICE_ACCOUNT_JSON");
    return;
  }

  // 3️⃣ Fallback (Cloud Functions / deployed GCP)
  admin.initializeApp();
  console.log("🔥 Firebase Admin initialized with default credentials");
}

initAdmin();

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
