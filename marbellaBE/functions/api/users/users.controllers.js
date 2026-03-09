/* eslint-disable */

const firebase_controller = require("../../fb");

const getUserByUID = async (uid) => {
  console.log("UID:", uid);
  try {
    const querySnapshot = await firebase_controller.db
      .collection("users")
      .where("uid", "==", uid)
      .get();

    if (querySnapshot.empty) {
      console.log("No user found with UID:", uid);
      return null;
    }

    let userData = null;
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      userData = doc.data(); // Assuming only one user matches the UID
    });

    console.log("USER FOUND:", userData);
    return userData;
  } catch (error) {
    console.error("Error fetching user by UID:", error);
    throw error;
  }
};
const getUserByEmail = async (email) => {
  console.log("EMAIL AT CONTROLLER:", email);
  try {
    const querySnapshot = await firebase_controller.db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!querySnapshot.empty) {
      // Assuming you only want the first matching document
      const userDoc = querySnapshot.docs[0];
      console.log(userDoc.id, " => ", userDoc.data());
      return userDoc.data();
    } else {
      console.log("No user found with the given email.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
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
    encrypted_pin,
    customer_qr,
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
    encrypted_pin,
    customer_qr,
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

// const updateUser = async (data, uid) => {
//   try {
//     if (!uid) return { status: 400, message: "Missing uid" };
//     if (!data || typeof data !== "object") {
//       return { status: 400, message: "Missing update data" };
//     }

//     // ✅ Only allow specific fields to be updated from client requests
//     // Add fields here as you expand features.
//     const ALLOWED_FIELDS = new Set([
//       "first_name",
//       "last_name",
//       "encrypted_pin",
//       "name",
//       "address",
//       "phone_number",
//       "display_name",
//       "email",
//     ]);

//     // Build update payload with only allowed keys
//     const updatePayload = {};
//     for (const [key, value] of Object.entries(data)) {
//       if (!ALLOWED_FIELDS.has(key)) continue;
//       if (value === undefined) continue; // ignore undefined
//       updatePayload[key] = value;
//     }

//     if (Object.keys(updatePayload).length === 0) {
//       return { status: 400, message: "No valid fields to update" };
//     }

//     // Always update updatedAt
//     updatePayload.updatedAt = new Date().toISOString();

//     // Find user's doc (docId is user_id, but we query by uid)
//     const snap = await firebase_controller.db
//       .collection("users")
//       .where("uid", "==", uid)
//       .limit(1)
//       .get();

//     if (snap.empty) {
//       return { status: 404, message: "User not found" };
//     }

//     const doc = snap.docs[0]; // doc.id === user_id in your setup
//     await doc.ref.update(updatePayload);

//     return { status: 200, message: "User updated" };
//   } catch (err) {
//     console.error("updateUser error:", err?.message ?? err);
//     return { status: 500, message: "Failed to update user" };
//   }
// };
const updateUser = async (data, uid) => {
  try {
    if (!uid) return { status: 400, message: "Missing uid" };
    if (!data || typeof data !== "object") {
      return { status: 400, message: "Missing update data" };
    }

    const ALLOWED_FIELDS = new Set([
      "first_name",
      "last_name",
      "email",
      "address",
      "phone_number",
      "display_name",
      "encrypted_pin",
    ]);

    const updatePayload = {};
    for (const [key, value] of Object.entries(data)) {
      if (!ALLOWED_FIELDS.has(key)) continue;
      if (value === undefined) continue;
      updatePayload[key] = value;
    }

    if (Object.keys(updatePayload).length === 0) {
      return { status: 400, message: "No valid fields to update" };
    }

    updatePayload.updatedAt = new Date().toISOString();

    const snap = await firebase_controller.db
      .collection("users")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    if (snap.empty) {
      return { status: 404, message: "User not found" };
    }

    const doc = snap.docs[0];
    await doc.ref.update(updatePayload);

    // Fetch updated doc
    const updatedSnap = await doc.ref.get();
    const updatedUser = {
      user_id: doc.id, // your docId is user_id
      ...updatedSnap.data(),
    };

    return { status: 200, message: "User updated", data: updatedUser };
  } catch (err) {
    console.error("updateUser error:", err?.message ?? err);
    return { status: 500, message: "Failed to update user" };
  }
};

module.exports = {
  getUserByUID,
  getUserByEmail,
  createUser,
  updateUser,
};
