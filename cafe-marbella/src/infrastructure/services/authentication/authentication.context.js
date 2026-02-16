import React, { useState, createContext, useEffect, useMemo } from "react";
import { Platform } from "react-native";
import {
  user_authenticated,
  usersInTheDevice,
} from "../../local_data/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  gettingUserByEmailRequest,
  put_new_pin_Request,
} from "./authentication.sevices";
import {
  post_user_Request,
  gettingUserByUIDRequest,
} from "./authentication.sevices";
import {
  STORAGE_KEYS,
  encryptPinWithServerPublicKey,
} from "../../services/authentication/authentication.handlers";
import { rootReset } from "../../../infrastructure/navigation/navigation_ref";
import { auth } from "../../../../fb";

export const AuthenticationContext = createContext();

const userToDBInitialState = {
  first_name: "",
  last_name: "",
  email: "",
  address: "",
  createdAt: "",
  updatedAt: "",
  display_name: "",
  phone_number: "",
};
export const Authentication_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [user, setUser] = useState(null);
  const [authInitializing, setAuthInitializing] = useState(true);
  const [comingFrom, setComingFrom] = useState(null);
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [userToDB, setUserToDB] = useState(userToDBInitialState);

  const [firebaseReady, setFirebaseReady] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);

  const { CURRENT_USER_KEY, USERS_ON_DEVICE_KEY } = STORAGE_KEYS;
  //**************** */ Local user persistency logic
  // 1) Rehydrate user on app start
  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      try {
        const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (cancelled) return;

        if (!raw) {
          setUser(null);
        } else {
          const parsed = JSON.parse(raw);
          setUser(parsed); // ✅ THIS fixes reload
        }
      } catch (e) {
        console.log("Auth boot error:", e);
        setUser(null);
      } finally {
        if (!cancelled) setAuthInitializing(false);
      }
    };

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    console.log("Auth currentUser at mount:", auth.currentUser?.uid || null);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      setFirebaseReady(true);
      console.log("Firebase auth state:", fbUser ? fbUser.uid : "signed out");
    });
    return unsub;
  }, []);

  // 2) Register (create user locally + persist)
  const registerLocalUser = async (newUser) => {
    setError(null);
    try {
      if (!newUser?.uid) throw new Error("User uid is required");

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      setUser(newUser); // ✅ important

      // users on device list (optional keep)
      const rawUsers = await AsyncStorage.getItem(USERS_ON_DEVICE_KEY);
      const users = rawUsers ? JSON.parse(rawUsers) : [];

      const exists = users.some((u) => u?.uid === newUser.uid);
      const nextUsers = exists ? users : [newUser, ...users];

      await AsyncStorage.setItem(
        USERS_ON_DEVICE_KEY,
        JSON.stringify(nextUsers)
      );

      return { ok: true };
    } catch (e) {
      setError(e.message || "Register failed");
      return { ok: false, error: e.message };
    }
  };

  // 3) Logout
  const logout = async () => {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  console.log(
    "USER TO DB IN AUTH CONTEXT: ",
    JSON.stringify(userToDB, null, 2)
  );
  console.log("USER IN AUTH CONTEXT: ", JSON.stringify(user, null, 2));
  const isAuthenticated = !!user;

  const [emailToSwitch, setEmailToSwitch] = useState("");

  // ✅ always derived from user (so it stays consistent)
  // const otherUsersInTheDevice = useMemo(async () => {
  //   if (!user?.user_id) return [];
  //   const usersInAsyncStorageRaw = await AsyncStorage.getItem(
  //     USERS_ON_DEVICE_KEY
  //   );
  //   const usersInAsyncStorage = usersInAsyncStorageRaw
  //     ? JSON.parse(usersInAsyncStorageRaw)
  //     : null;
  //   console.log(
  //     "USERS IN ASYNC STORAGE:",
  //     JSON.stringify(usersInAsyncStorage, null, 2)
  //   );
  //   return usersInAsyncStorage.filter((u) => u?.user_id !== user.user_id);
  // }, [user]);

  const [otherUsersInTheDevice, setOtherUsersInTheDevice] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!user?.user_id) {
        setOtherUsersInTheDevice([]);
        return;
      }

      try {
        const raw = await AsyncStorage.getItem(USERS_ON_DEVICE_KEY);

        // If raw is null, default to []
        const parsed = raw ? JSON.parse(raw) : [];

        // guard: if parsed isn't an array, fallback
        const list = Array.isArray(parsed) ? parsed : [];

        const others = list.filter((u) => u?.user_id !== user.user_id);

        if (!cancelled) setOtherUsersInTheDevice(others);
      } catch (e) {
        console.log("Failed reading USERS_ON_DEVICE_KEY:", e);
        if (!cancelled) setOtherUsersInTheDevice([]);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.user_id]);

  // const otherUsersInTheDevice = useMemo(() => {
  //   if (!user?.user_id) return [];
  //   return usersInTheDevice.filter((u) => u?.user_id !== user.user_id);
  // }, [user]);

  const loginDevUser = (userData) => {
    setUser(user_authenticated);
  };

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

  // ********************* REGISTER USER LOGIC *************************
  //We generate a random 6-digit PIN
  const generatePin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const registerUser = async (userToDB, cartPayload) => {
    setIsLoading(true);
    const pinGenerated = generatePin();
    const email = userToDB.email;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pinGenerated
      );
      const idToken = await userCredential.user.getIdToken();
      console.log("USER ID TOKEN:", idToken);

      console.log("PIN GENERATED BEFORE ENCRYPTION:", pinGenerated);
      const encrypted_pin = encryptPinWithServerPublicKey(pinGenerated);
      console.log("ENCRYPTED PIN:", encrypted_pin);

      const payload = {
        ...userToDB,
        encrypted_pin: encrypted_pin, // ideally remove later
      };

      const res = await post_user_Request(payload, cartPayload, idToken);

      if (res?.user?.[0] && res?.cart?.[0]) {
        await registerLocalUser(res.user[0]); // ✅ persist & set user state
        return { ok: true, user: res.user[0], cart: res.cart[0] };
      }

      return {
        ok: false,
        error: "Invalid server response",
      };
    } catch (error) {
      console.log("REGISTER USER ERROR (raw):", {
        code: error?.code,
        message: error?.message,
        name: error?.name,
      });

      if (error?.code === "auth/email-already-in-use") {
        return { ok: false, error: "Email already in use" };
      }

      return { ok: false, error: error?.message || "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  // ********************* LOG IN USER LOGIC *************************
  const signingInWithEmailAndPasswordFunction = async (email, pin) => {
    // setIsLoading(true);
    console.log("EMAIL AT SIGNIN FUNCTION:", email);
    console.log("PIN AT SIGNIN FUNCTION:", pin);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // await savePin(pin);
      const userCredential = await signInWithEmailAndPassword(auth, email, pin);
      console.log("USER LOGGED IN:", userCredential.user);

      if (userCredential.user) {
        console.log(
          "USER LOGGED IN:",
          JSON.stringify(userCredential.user, null, 2)
        );
        const raw = await gettingUserByUIDRequest(userCredential.user.uid);
        const userByUID = Array.isArray(raw) ? raw[0] : raw;
        if (!userByUID) throw new Error("User not found in DB");

        await registerLocalUser(userByUID);
        setUser(userByUID);
        return { ok: true, user: userByUID };
      }
    } catch (error) {
      setError(
        error.message === "Firebase: Error (auth/missing-email)."
          ? "We haven't found an email for this PIN number"
          : error.message === "Firebase: Error (auth/invalid-credential)."
          ? "We haven't found a user for this PIN number"
          : error.message === "Firebase: Error (auth/too-many-requests)."
          ? "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your PIN or you can try again later."
          : null
      );
    }
  };

  const loginUser = async (pin, email) => {
    setIsLoading(true);
    console.log("PIN BEFORE LOGIN:", pin);
    console.log("EMAIL BEFORE LOGIN:", email);

    try {
      const PIN_LENGTH = 6;
      if (pin.length === PIN_LENGTH) {
        console.log("PIN BEFORE LOGIN:", pin);
        const res = await signingInWithEmailAndPasswordFunction(email, pin);
        if (res?.ok && res?.user) {
          console.log("RES DATA ON LOGIN USER:", res.user);
          return res;
        }
        return {
          ok: false,
          error: res?.msg || "Invalid email or password",
        };
      }
    } catch (error) {
      console.log("LOGIN USER ERROR:", error);
      return {
        ok: false,
        error: error?.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ********************* LOG OUT USER LOGIC *************************
  const AUTH_KEYS_TO_CLEAR = [
    "@marbella/current_user",
    // "@marbella/cart",
    // "@marbella/my_order",
    // "@marbella/tax_calculation_id",
  ];

  const signOut = async () => {
    setIsLoading(true);
    try {
      // 1) Firebase auth sign out (clears firebase:authUser key)
      await auth.signOut();

      // 2) Clear only auth-session keys (keep users_on_device, keep guest_cart)
      await AsyncStorage.multiRemove(AUTH_KEYS_TO_CLEAR);

      //3 ) Reset the states at context
      resetAuthContext();

      // 4) Reset navigation to the normal guest experience: App Tabs -> Shop -> Home_View
      rootReset({
        index: 0,
        routes: [
          {
            name: "App",
            state: {
              index: 0,
              routes: [
                {
                  name: "Shop",
                  state: {
                    index: 0,
                    routes: [{ name: "Home_View" }],
                  },
                },
              ],
            },
          },
        ],
      });
    } catch (e) {
      console.log("SIGN OUT ERROR:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePinNumberOnDemand = async (newPIN) => {
    setIsLoading(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        return {
          ok: false,
          error: "No Firebase session. Please log in again.",
        };
      }

      // const idToken = await user.getIdToken(true);
      const idToken = await getFreshIdToken();
      console.log(" CURRENT USER TOKEN:", idToken);

      // 2) create encrypted pin
      const new_encrypted_pin = encryptPinWithServerPublicKey(newPIN);

      // 3) call backend (token in header)
      const payload = {
        new_encrypted_pin: new_encrypted_pin, // ideally remove later
        new_pin: newPIN, // ideally remove later
      };
      console.log(
        " GENERATE NEW PIN ON DEMAND PAYLOAD:",
        JSON.stringify(payload, null, 2)
      );
      const res = await put_new_pin_Request(payload, idToken);
      console.log(
        "RESPONSE FROM GENERATE NEW PIN ON DEMAND REQUEST:",
        JSON.stringify(res, null, 2)
      );

      if (res?.ok) return { ok: true };

      return { ok: false, error: res?.message || "Failed to update PIN" };
    } catch (error) {
      return { ok: false, error: error?.message || "Unknown error" };
    } finally {
      setIsLoading(false);
    }
  };

  // Generate new pin number on Demand
  // const generatePinNumberOnDemand = async (newPIN) => {
  //   setIsLoading(true);
  //   console.log("NEW PIN NUMBER TO ENCRYPT:", newPIN);

  //   try {
  //     const new_encrypted_pin = encryptPinWithServerPublicKey(newPIN);
  //     console.log(" NEW ENCRYPTED PIN:", new_encrypted_pin);

  //     const idToken = await auth.currentUser.getIdToken(true);
  //     console.log(" CURRENT USER TOKEN:", idToken);

  //     const payload = {
  //       new_encrypted_pin: new_encrypted_pin, // ideally remove later
  //       new_pin: newPIN, // ideally remove later
  //       idToken,
  //     };

  //     console.log(
  //       " GENERATE NEW PIN ON DEMAND PAYLOAD:",
  //       JSON.stringify(payload, null, 2)
  //     );

  //     const res = await put_new_pin_Request(payload);

  //     console.log(
  //       "RESPONSE FROM GENERATE NEW PIN ON DEMAND REQUEST:",
  //       JSON.stringify(res, null, 2)
  //     );
  //     if (res?.ok && res?.message === "User updated") {
  //       return { ok: true };
  //     } else {
  //       return {
  //         ok: false,
  //         error: res?.message || "Failed to generate new PIN",
  //       };
  //     }

  //     // return {
  //     //   ok: false,
  //     //   error: "Invalid server response",
  //     // };
  //   } catch (error) {
  //     console.log("GENERATE NEW PIN ERROR (raw):", {
  //       code: error?.code,
  //       message: error?.message,
  //       name: error?.name,
  //     });
  //     // console.log("REGISTER USER ERROR (raw):", {
  //     //   code: error?.code,
  //     //   message: error?.message,
  //     //   name: error?.name,
  //     // });

  //     // if (error?.code === "auth/email-already-in-use") {
  //     //   return { ok: false, error: "Email already in use" };
  //     // }

  //     // return { ok: false, error: error?.message || "Registration failed" };
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const resetAuthContext = () => {
    setUser(null);
    setIsLoading(false);
    setError(null);
    setEmail("");
    setPin("");
    setUserToDB(userToDBInitialState);
  };
  const waitForFirebaseUserOnce = () =>
    new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, (u) => {
        unsub();
        resolve(u);
      });
    });

  const getFreshIdToken = async () => {
    // If Firebase hasn’t finished initializing, wait for it once
    let fbUser = auth.currentUser;

    if (!fbUser) {
      fbUser = await waitForFirebaseUserOnce();
    }

    if (!fbUser) {
      const e = new Error("No Firebase session. Please log in again.");
      e.code = "NO_SESSION";
      throw e;
    }

    try {
      return await fbUser.getIdToken(true); // force refresh
    } catch (e) {
      if (
        e?.code === "auth/user-token-expired" ||
        e?.code === "auth/invalid-user-token" ||
        e?.code === "auth/user-disabled"
      ) {
        try {
          await auth.signOut();
        } catch (_) {}
        const err = new Error("Session expired. Please log in again.");
        err.code = e?.code;
        throw err;
      }
      throw e;
    }
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isLoading,
        error,
        user,
        setUser, // (optional expose)
        otherUsersInTheDevice,
        emailToSwitch,
        setEmailToSwitch,
        gettingUserByEmailToAuthenticated,
        isAuthenticated,
        loginDevUser,
        logout,
        setUserToDB,
        userToDB,
        registerUser,
        authInitializing,
        registerLocalUser,
        comingFrom,
        setComingFrom,
        signOut,
        setPin,
        setEmail,
        loginUser,
        pin,
        email,
        emailError,
        setEmailError,
        generatePinNumberOnDemand,
        firebaseReady,
        firebaseUser,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
