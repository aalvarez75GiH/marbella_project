import React, { useState, createContext, useEffect, useMemo } from "react";
import {
  user_authenticated,
  usersInTheDevice,
} from "../../local_data/authentication";
import { gettingUserByEmailRequest } from "./authentication.sevices";

export const AuthenticationContext = createContext();

export const Authentication_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ THIS is the user you use everywhere
  const [user, setUser] = useState(usersInTheDevice[0] ?? null);

  const [emailToSwitch, setEmailToSwitch] = useState("");

  // ✅ always derived from user (so it stays consistent)
  const otherUsersIntheDevice = useMemo(() => {
    if (!user?.user_id) return [];
    return usersInTheDevice.filter((u) => u?.user_id !== user.user_id);
  }, [user]);

  // initial “auth check”
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        if (!user_authenticated) {
          setUser(null);
        }
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  const normalizeUser = (user) => ({
    authenticated: true,
    role: "user",
    ...user,
  });

  const gettingUserByEmailToAuthenticated = async (email) => {
    const MIN_LOADING_TIME = 800; // ms (tweak: 600–1200 feels good)
    console.log("EMAIL TO SWITCH:", email);

    const startTime = Date.now();
    setIsLoading(true);

    try {
      const userToSwitch = await gettingUserByEmailRequest(email);

      const normalized = {
        authenticated: true,
        role: userToSwitch?.role ?? "user",
        ...userToSwitch,
      };

      setUser(normalized);
      setEmailToSwitch("");

      return { ok: true, user: normalized };
    } catch (e) {
      // ✅ IMPORTANT: handle 404 cleanly
      const status = e?.response?.status;
      const msgFromApi =
        e?.response?.data?.status === "NotFound"
          ? "User not found."
          : e?.response?.data?.msg;

      if (status === 404) {
        return {
          ok: false,
          code: "NOT_FOUND",
          message: msgFromApi || "User not found.",
        };
      }

      return {
        ok: false,
        code: "REQUEST_FAILED",
        message: msgFromApi || String(e),
      };
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(MIN_LOADING_TIME - elapsed, 0);

      setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    }
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isLoading,
        error,
        user,
        setUser, // (optional expose)
        otherUsersIntheDevice,
        emailToSwitch,
        setEmailToSwitch,
        gettingUserByEmailToAuthenticated,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

// import React, { useState, createContext, useEffect } from "react";

// import {
//   user_authenticated,
//   usersInTheDevice,
// } from "../../local_data/authentication";
// import { gettingUserByEmailRequest } from "./authentication.sevices";
// export const AuthenticationContext = createContext();

// export const Authentication_Context_Provider = ({ children }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(usersInTheDevice[0]);
//   const [currentUser, setCurrentUser] = useState(usersInTheDevice[0]);
//   const [otherUsersIntheDevice, setOtherUsersIntheDevice] = useState([]);
//   const [emailToSwitch, setEmailToSwitch] = React.useState("");
//   // console.log("USER AT AUTH CONTEXT: ", JSON.stringify(user, null, 2));

//   useEffect(() => {
//     setIsLoading(true);
//     setTimeout(() => {
//       try {
//         // Simulate authentication check
//         if (user_authenticated) {
//           setUser(currentUser);
//           const others = usersInTheDevice.filter(
//             (u) => u.user_id !== currentUser.user_id
//           );
//           setOtherUsersIntheDevice(others);
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         setError(error);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 1000);
//   }, []);

//   const gettingUserByEmailToAuthenticated = async (email) => {
//     console.log("EMAIL TO SWITCH:", email);
//     setIsLoading(true);
//     try {
//       const userToSwitch = await gettingUserByEmailRequest(email);
//       console.log(
//         "USER TO SWITCH FETCHED BY EMAIL:",
//         JSON.stringify(userToSwitch, null, 2)
//       );
//       // setUser(userToSwitch);
//       return {
//         ok: true,
//         user: userToSwitch,
//       };
//     } catch (error) {
//       console.error("Error fetching user by email:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AuthenticationContext.Provider
//       value={{
//         isLoading,
//         currentUser,
//         user,
//         otherUsersIntheDevice,
//         emailToSwitch,
//         setEmailToSwitch,
//         gettingUserByEmailToAuthenticated,
//       }}
//     >
//       {children}
//     </AuthenticationContext.Provider>
//   );
// };
