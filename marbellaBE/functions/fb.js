/* eslint-disable */

// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const getAuth = admin.auth();
// const db = admin.firestore();

// module.exports = {
//   db,
//   getAuth,
// };

const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp(); // ✅ works in emulator + deployed functions
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
