/* eslint-disable */

const firebase_controller = require("../../fb");
const axios = require("axios");

const getUserByUID = async (uid) => {
  console.log("UID:", uid);

  try {
    const querySnapshot = await firebase_controller.db
      .collection("users")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      console.log("No user found with UID:", uid);
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

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
    ship_to,
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
    ship_to,
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
      "ship_to",
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

const validateEmail = async (email) => {
  const response = await axios.get(
    "https://emailreputation.abstractapi.com/v1/",
    {
      params: {
        api_key: process.env.ABSTRACT_EMAIL_REPUTATION_KEY,
        email,
      },
      timeout: 10000,
    }
  );

  // console.log("ABSTRACT RESPONSE:", JSON.stringify(response.data, null, 2));
  const data = response.data;
  console.log("ABSTRACT SUMMARY:", {
    email: data?.email_address,
    status: data?.email_deliverability?.status,
    statusDetail: data?.email_deliverability?.status_detail,
    smtp: data?.email_deliverability?.is_smtp_valid,
    mx: data?.email_deliverability?.is_mx_valid,
    risk: data?.email_risk?.address_risk_status,
  });

  const status = data?.email_deliverability?.status;
  const statusDetail = data?.email_deliverability?.status_detail;
  const isFormatValid = data?.email_deliverability?.is_format_valid;
  const isSmtpValid = data?.email_deliverability?.is_smtp_valid;
  const isMxValid = data?.email_deliverability?.is_mx_valid;
  const isDisposable = data?.email_quality?.is_disposable;
  const addressRisk = data?.email_risk?.address_risk_status;

  console.log("EMAIL CHECK RESULT:", {
    status,
    statusDetail,
    isFormatValid,
    isSmtpValid,
    isMxValid,
    isDisposable,
    addressRisk,
  });

  return (
    status === "deliverable" &&
    isFormatValid === true &&
    isMxValid === true &&
    isSmtpValid === true &&
    isDisposable === false &&
    addressRisk !== "high"
  );
};

module.exports = {
  getUserByUID,
  getUserByEmail,
  createUser,
  updateUser,
  validateEmail,
};
