import axios from "axios";
import { environment } from "../../../util/env";

export const gettingUserByEmailRequest = async (email) => {
  const { usersEndPoint } = environment;
  const endpoint = `${usersEndPoint}/userByEmail`;
  try {
    const res = await axios.post(
      endpoint,
      { email },
      {
        timeout: 15000, // Optional timeout
      }
    );

    // console.log("RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    const status = error?.response?.status;

    // 404 is an expected business case (user doesn't exist)
    if (status !== 404) {
      console.error("Error fetching user by email:", error);
    }

    throw error;
  }
};

export const post_user_Request = async (
  userToCreateAtFirebaseAndDB,
  cart_payload
) => {
  console.log(
    "USER TO DB BEFORE REQUEST:",
    JSON.stringify(userToCreateAtFirebaseAndDB, null, 2)
  );
  const { usersEndPoint } = environment;
  const endpoint = `${usersEndPoint}/`;
  try {
    const res = await axios.post(
      endpoint,
      { ...userToCreateAtFirebaseAndDB, cart_payload },
      {
        timeout: 15000, // Optional timeout
      }
    );

    // console.log("RESPONSE:", res.data);
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
