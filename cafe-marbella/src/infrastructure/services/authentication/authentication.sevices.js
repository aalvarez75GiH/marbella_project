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
    console.error("Error fetching user by email:", error);
    throw error;
  }
};
