import axios from "axios";
import { environment } from "../../../util/env";

// export const gettingUserByEmailRequest = async (email) => {
//   const { usersEndPoint } = environment;
//   const endpoint = `${usersEndPoint}/userByEmail`;
//   try {
//     const res = await axios.post(
//       endpoint,
//       { email },
//       {
//         timeout: 15000, // Optional timeout
//       }
//     );

//     // console.log("RESPONSE:", res.data);
//     return res.data;
//   } catch (error) {
//     const status = error?.response?.status;

//     // 404 is an expected business case (user doesn't exist)
//     if (status !== 404) {
//       console.error("Error fetching user by email:", error);
//     }

//     throw error;
//   }
// };
export const gettingUserByEmailRequest = async (email) => {
  const { usersEndPoint } = environment;
  const endpoint = `${usersEndPoint}/userByEmail`;
  try {
    const response = await axios.post(endpoint, { email }, { timeout: 15000 });

    return response.data?.user ?? null;
  } catch (error) {
    if (error?.response?.status === 404) {
      return {
        ok: false,
        code: "user_not_found",
      };
    }

    throw error;
  }
};
export const gettingUserByUIDRequest = async (uid) => {
  const { usersEndPoint } = environment;
  const endpoint = `${usersEndPoint}/userByUID`;

  const res = await axios.get(endpoint, {
    params: { uid }, // <-- goes to req.query.uid
    timeout: 15000,
  });

  return res.data;
};

export const post_user_Request = async (
  userToCreateAtFirebaseAndDB,
  cart_payload,
  idToken
) => {
  // console.log(
  //   "USER TO DB BEFORE REQUEST:",
  //   JSON.stringify(userToCreateAtFirebaseAndDB, null, 2)
  // );

  const { usersEndPoint } = environment;
  const endpoint = `${usersEndPoint}/`;

  try {
    const res = await axios.post(
      endpoint,
      {
        ...userToCreateAtFirebaseAndDB,
        cart_payload,
      },
      {
        timeout: 15000,
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error creating user:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      endpoint,
    });
    throw error;
  }
};

export const put_new_pin_Request = async (payload, idToken) => {
  const endpoint = `${environment.usersEndPoint}/new_pin_on_demand`;

  const res = await axios.put(endpoint, payload, {
    headers: { Authorization: `Bearer ${idToken}` },
    timeout: 15000,
  });

  return res.data; // { ok: true, message: ... }
};
export const put_update_userinfo_Request = async (userToDB, idToken) => {
  const endpoint = `${environment.usersEndPoint}/update_user_info`;

  try {
    console.log(
      "USER TO DB BEFORE UPDATE INFO REQUEST:",
      JSON.stringify(userToDB, null, 2)
    );

    const res = await axios.put(endpoint, userToDB, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    console.log("UPDATE INFO RESPONSE:", JSON.stringify(res.data, null, 2));

    return res.data;
  } catch (e) {
    console.log("UPDATE INFO ERROR:", {
      status: e?.response?.status,
      data: e?.response?.data,
      message: e?.message,
    });

    return {
      ok: false,
      error: e?.response?.data?.error ?? e?.message ?? "UPDATE_FAILED",
    };
  }
};

export const post_email_deliverability_Request = async (email) => {
  const { usersEndPoint } = environment;
  const endpoint = `${usersEndPoint}/validate-email`;

  try {
    const payload = {
      email: String(email || "")
        .trim()
        .toLowerCase(),
    };

    console.log("EMAIL BEFORE REQUEST:", JSON.stringify(payload, null, 2));

    const res = await axios.post(endpoint, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    console.log(
      "EMAIL VALIDATION RESPONSE:",
      JSON.stringify(res.data, null, 2)
    );

    return res.data;
  } catch (e) {
    console.log("EMAIL VALIDATION ERROR:", {
      status: e?.response?.status,
      data: e?.response?.data,
      message: e?.message,
    });

    return {
      ok: false,
      code: e?.response?.data?.code,
      error: e?.response?.data?.msg || e?.message || "EMAIL_VALIDATION_FAILED",
    };
  }
};
