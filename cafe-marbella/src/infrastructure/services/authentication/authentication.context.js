import React, { useState, createContext, useEffect, useMemo } from "react";
import {
  signInWithCustomToken,
  updateEmail,
  verifyBeforeUpdateEmail,
} from "firebase/auth";

import { Alert } from "react-native";
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
  put_update_userinfo_Request,
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
  const [emailToSwitch, setEmailToSwitch] = useState("");
  const [otherUsersInTheDevice, setOtherUsersInTheDevice] = useState([]);
  const [isOtherUsers, setIsOtherUsers] = useState(false);
  const [reset_pin_1, set_Reset_Pin_1] = useState("");
  const [reset_pin_2, set_Reset_Pin_2] = useState("");
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);

  const { CURRENT_USER_KEY, USERS_ON_DEVICE_KEY } = STORAGE_KEYS;
  //**************** */ Local user persistency logic
  console.log("auth.context auth app name on context:", auth?.app?.name);

  useEffect(() => {
    const orig = auth.signOut.bind(auth);
    auth.signOut = async (...args) => {
      console.log("🔥 FIREBASE SIGNOUT CALLED 🔥", new Error().stack);
      return orig(...args);
    };
    return () => {
      auth.signOut = orig;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      console.log("Firebase auth state:", fbUser ? fbUser.uid : "signed out");

      if (cancelled) return;

      setFirebaseUser(fbUser);
      setFirebaseReady(true);
      setAuthInitializing(false);

      if (!fbUser) {
        setUser(null);
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
        return;
      }

      try {
        try {
          const fin = await finalizePendingEmailChange(fbUser);
          console.log("finalize onAuthStateChanged:", fin);
        } catch (e) {
          console.log("finalize failed:", e?.message ?? e);
        }
        // ✅ load DB user using UID from firebase
        const raw = await gettingUserByUIDRequest(fbUser.uid);
        const userByUID = Array.isArray(raw) ? raw[0] : raw;

        if (!userByUID) throw new Error("User not found in DB");

        setUser(userByUID);
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userByUID));
      } catch (error) {
        console.log("Failed to load DB user:", error?.message ?? error);
        // optional: force sign out if DB user missing
        await auth.signOut();
        setUser(null);
      }
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  // This useEffect sets the list of other users in the device, excluding the currently authenticated user.
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

        // const others = list.filter((u) => u?.user_id !== user.user_id);
        const others = list.filter((u) => u?.uid !== user.uid);
        setIsOtherUsers(others.length > 0);

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
  }, [user?.uid]);

  // helper regex to validate PIN format (6 digits)
  const isValidPin = /^\d{6}$/.test(pin);

  //  Register (create user locally + persist)
  const registerLocalUser = async (newUser) => {
    setError(null);
    try {
      if (!newUser?.uid) throw new Error("User uid is required");

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      setUser(newUser); // ✅ important

      const rawUsers = await AsyncStorage.getItem(USERS_ON_DEVICE_KEY);
      const users = rawUsers ? JSON.parse(rawUsers) : [];
      const list = Array.isArray(users) ? users : [];

      const idx = list.findIndex((u) => u?.uid === newUser.uid);

      let nextUsers = [...list];
      if (idx >= 0) {
        nextUsers[idx] = { ...nextUsers[idx], ...newUser }; // ✅ replace/update existing
      } else {
        nextUsers = [newUser, ...nextUsers];
      }

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

  // Logout
  // const logout = async () => {
  //   await auth.signOut();
  //   await AsyncStorage.removeItem(CURRENT_USER_KEY);
  //   setUser(null);
  // };
  // console.log(
  //   "USER SCHEMA TO REGISTER USER AT AUTH CONTEXT: ",
  //   JSON.stringify(userToDB, null, 2)
  // );
  // console.log("USER IN AUTH CONTEXT: ", JSON.stringify(user, null, 2));
  const isAuthenticated = !!user;

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
      // console.log("USER ID TOKEN:", idToken);

      console.log("PIN GENERATED BEFORE ENCRYPTION:", pinGenerated);
      const encrypted_pin = encryptPinWithServerPublicKey(pinGenerated);
      // console.log("ENCRYPTED PIN:", encrypted_pin);

      const payload = {
        ...userToDB,
        encrypted_pin: encrypted_pin, // ideally remove later
      };

      // console.log(
      //   "PAYLOAD TO REGISTER USER:",
      //   JSON.stringify(payload, null, 2)
      // );
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
    // console.log("EMAIL AT SIGNIN FUNCTION:", email);
    // console.log("PIN AT SIGNIN FUNCTION:", pin);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const userCredential = await signInWithEmailAndPassword(auth, email, pin);
      // console.log("USER LOGGED IN:", userCredential.user);

      if (userCredential.user) {
        // ✅ FINALIZE HERE (before DB fetch)
        try {
          const finalize = await finalizePendingEmailChange(
            userCredential.user
          );
          console.log("finalize after login:", finalize);
        } catch (e) {
          console.log("finalize failed:", e?.message ?? e);
        }

        const raw = await gettingUserByUIDRequest(userCredential.user.uid);
        const userByUID = Array.isArray(raw) ? raw[0] : raw;
        if (!userByUID) throw new Error("User not found in DB");

        await registerLocalUser(userByUID);
        setUser(userByUID);
        return { ok: true, user: userByUID };
      }
    } catch (error) {
      setError(/* ... */);
    }
  };

  const loginUser = async (pin, email) => {
    setIsLoading(true);
    // console.log("PIN BEFORE LOGIN:", pin);
    // console.log("EMAIL BEFORE LOGIN:", email);

    try {
      const PIN_LENGTH = 6;
      if (pin.length === PIN_LENGTH) {
        // console.log("PIN BEFORE LOGIN:", pin);
        const res = await signingInWithEmailAndPasswordFunction(email, pin);
        if (res?.ok && res?.user) {
          // console.log("RES DATA ON LOGIN USER:", res.user);
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

  // const generatePinNumberOnDemand = async (newPIN) => {
  //   console.log("PIN auth app name on function:", auth?.app?.name);
  //   setIsLoading(true);

  //   try {
  //     // ✅ If auth.currentUser isn't ready yet (common right after register),
  //     // wait a moment for Firebase to settle, then proceed automatically.
  //     let fbUser = auth.currentUser;

  //     if (!fbUser) {
  //       console.log("PIN: auth.currentUser null, waiting briefly...");
  //       fbUser = await waitForFirebaseUserOnce(2500);
  //     }

  //     if (!fbUser) {
  //       return {
  //         ok: false,
  //         error: "No Firebase session. Please log in again.",
  //       };
  //     }

  //     // 1) get a fresh idToken for backend verification
  //     const idToken = await fbUser.getIdToken(true);
  //     console.log("CURRENT USER ID TOKEN", idToken);

  //     // 2) encrypt pin for your DB
  //     const new_encrypted_pin = encryptPinWithServerPublicKey(newPIN);

  //     // 3) call backend (token in header)
  //     const payload = { new_encrypted_pin, new_pin: newPIN };
  //     const res = await put_new_pin_Request(payload, idToken);

  //     console.log("RES AT GENERATING:", JSON.stringify(res, null, 2));
  //     console.log("PAYLOAD:", JSON.stringify(payload, null, 2));

  //     if (!res?.ok) {
  //       return {
  //         ok: false,
  //         error: res?.error || res?.message || "Failed to update PIN",
  //       };
  //     }

  //     // ✅ PIN == Firebase password. Best practice:
  //     // - If backend returns customToken: reauth seamlessly
  //     // - Otherwise: force sign out (clean state)
  //     if (res?.customToken) {
  //       await signInWithCustomToken(auth, res.customToken);
  //       await auth.currentUser?.getIdToken(true);
  //       return { ok: true, reauthed: true };
  //     }

  //     await auth.signOut();
  //     return { ok: true, mustReLogin: true };
  //   } catch (error) {
  //     console.log("generatePinNumberOnDemand error:", error?.message ?? error);
  //     return { ok: false, error: error?.message || "Unknown error" };
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const generatePinNumberOnDemand = async (newPIN) => {
    setIsLoading(true);

    try {
      console.log("PIN: start", {
        firebaseReady,
        hasFirebaseUserState: !!firebaseUser,
        hasAuthCurrentUser: !!auth.currentUser,
      });

      const fbUser = await getFirebaseUserOrWait(12000);

      if (!fbUser) {
        return {
          ok: false,
          error: "Your session is still loading. Please try again in a moment.",
        };
      }

      const idToken = await fbUser.getIdToken(true);

      const new_encrypted_pin = encryptPinWithServerPublicKey(newPIN);
      const payload = { new_encrypted_pin, new_pin: newPIN };

      const res = await put_new_pin_Request(payload, idToken);

      if (!res?.ok) {
        return {
          ok: false,
          error: res?.error || res?.message || "Failed to update PIN",
        };
      }

      // ✅ Best UX: backend returns customToken so user stays logged in
      if (res?.customToken) {
        await signInWithCustomToken(auth, res.customToken);
        await auth.currentUser?.getIdToken(true);
        return { ok: true, reauthed: true };
      }

      // If no customToken, Firebase password changed -> session may become invalid.
      // You can still return success and let user continue, but best practice is reauth.
      return { ok: true, mustReLogin: true };
    } catch (e) {
      console.log("PIN error:", e?.message ?? e);
      return { ok: false, error: e?.message || "Unknown error" };
    } finally {
      setIsLoading(false);
    }
  };

  const resetAuthContext = () => {
    setUser(null);
    setIsLoading(false);
    setError(null);
    setEmail("");
    setPin("");
    setUserToDB(userToDBInitialState);
  };
  // const waitForFirebaseUserOnce = () =>
  //   new Promise((resolve) => {
  //     const unsub = onAuthStateChanged(auth, (u) => {
  //       unsub();
  //       resolve(u);
  //     });
  //   });

  const waitForFirebaseUserOnce = (timeoutMs = 2500) =>
    new Promise((resolve) => {
      let done = false;

      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        unsub?.();
        resolve(null);
      }, timeoutMs);

      const unsub = onAuthStateChanged(auth, (u) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        unsub();
        resolve(u);
      });
    });
  const getFreshIdToken = async (timeoutMs = 2500) => {
    let fbUser = auth.currentUser;
    if (!fbUser) fbUser = await waitForFirebaseUserOnce(timeoutMs);
    if (!fbUser)
      throw Object.assign(new Error("No Firebase session."), {
        code: "NO_SESSION",
      });
    return fbUser.getIdToken(true);
  };
  const getFirebaseUserOrWait = async (timeoutMs = 12000) => {
    // If our context already has it, use it immediately
    if (firebaseUser) return firebaseUser;

    // If not ready yet, wait for auth state to emit
    return new Promise((resolve) => {
      let done = false;

      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        unsub?.();
        resolve(null);
      }, timeoutMs);

      const unsub = onAuthStateChanged(auth, (u) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        unsub();
        resolve(u);
      });
    });
  };

  // const getFreshIdToken = async () => {
  //   console.log("getFreshIdToken: start", {
  //     hasCurrentUser: !!auth.currentUser,
  //     uid: auth.currentUser?.uid ?? null,
  //   });
  //   // If Firebase hasn’t finished initializing, wait for it once
  //   let fbUser = auth.currentUser;

  //   if (!fbUser) {
  //     fbUser = await waitForFirebaseUserOnce();
  //   }

  //   if (!fbUser) {
  //     const e = new Error("No Firebase session. Please log in again.");
  //     e.code = "NO_SESSION";
  //     throw e;
  //   }

  //   try {
  //     return await fbUser.getIdToken(true); // force refresh
  //   } catch (e) {
  //     if (
  //       e?.code === "auth/user-token-expired" ||
  //       e?.code === "auth/invalid-user-token" ||
  //       e?.code === "auth/user-disabled"
  //     ) {
  //       try {
  //         await auth.signOut();
  //       } catch (_) {}
  //       const err = new Error("Session expired. Please log in again.");
  //       err.code = e?.code;
  //       throw err;
  //     }
  //     throw e;
  //   }
  // };

  const handleUpdate = async (userToDB) => {
    setIsLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return { ok: false, error: "SIGNED_OUT" };

      const newEmail = (userToDB?.email ?? "").trim().toLowerCase();
      const oldEmail = (currentUser.email ?? "").trim().toLowerCase();
      const emailChanged = !!newEmail && newEmail !== oldEmail;

      if (emailChanged) {
        const r = await startEmailChange({ newEmail, userPatch: userToDB });
        if (!r.ok) return r;

        return { ok: true, emailChanged: true, pendingEmail: newEmail };
      }

      // No email change -> normal DB update now
      const idToken = await currentUser.getIdToken(true);
      const res = await put_update_userinfo_Request(userToDB, idToken);
      if (res?.ok) {
        setUser(res.data);
        await updateUserEverywhereInStorage(res.data);
        return { ok: true, emailChanged: false };
      }
      return { ok: false, error: res?.error ?? "DB_UPDATE_FAILED" };
    } catch (e) {
      if (e?.code === "auth/requires-recent-login") {
        return { ok: false, error: "requires_recent_login" };
      }
      if (e?.code === "auth/email-already-in-use") {
        return { ok: false, error: "email_already_in_use" };
      }
      return { ok: false, error: e?.message ?? "unknown" };
    } finally {
      setIsLoading(false);
    }
  };

  const PENDING_EMAIL_CHANGE_KEY = "PENDING_EMAIL_CHANGE";
  const startEmailChange = async ({ newEmail, userPatch }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return { ok: false, error: "SIGNED_OUT" };

    const actionCodeSettings = {
      url: "https://cafe-marbella-be.web.app",
      handleCodeInApp: false,
    };

    await verifyBeforeUpdateEmail(currentUser, newEmail, actionCodeSettings);

    await AsyncStorage.setItem(
      PENDING_EMAIL_CHANGE_KEY,
      JSON.stringify({ pendingEmail: newEmail, userPatch })
    );

    return { ok: true };
  };

  const finalizePendingEmailChange = async (firebaseUser) => {
    const raw = await AsyncStorage.getItem(PENDING_EMAIL_CHANGE_KEY);
    if (!raw) return { ok: true, skipped: true };

    const { pendingEmail, userPatch } = JSON.parse(raw);

    const currentUser = firebaseUser ?? auth.currentUser;
    if (!currentUser) return { ok: false, error: "SIGNED_OUT" };

    await currentUser.reload();

    const firebaseEmail = (currentUser.email ?? "").trim().toLowerCase();
    const expectedEmail = (pendingEmail ?? "").trim().toLowerCase();

    console.log("Firebase email:", firebaseEmail);
    console.log("Expected email:", expectedEmail);

    if (firebaseEmail !== expectedEmail) {
      return {
        ok: false,
        error: "NOT_VERIFIED_YET",
        firebaseEmail,
        expectedEmail,
      };
    }

    const idToken = await currentUser.getIdToken(true);
    const res = await put_update_userinfo_Request(userPatch ?? {}, idToken);

    if (res?.ok) {
      setUser(res.data);
      await updateUserEverywhereInStorage(res.data);
      await AsyncStorage.removeItem(PENDING_EMAIL_CHANGE_KEY);
      return { ok: true, updated: true };
    }

    return { ok: false, error: res?.error ?? "DB_UPDATE_FAILED" };
  };

  const updateUserEverywhereInStorage = async (updatedUser) => {
    try {
      // Update current user key
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      // Update users_on_device list (replace matching uid)
      const raw = await AsyncStorage.getItem(USERS_ON_DEVICE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];

      const nextList = list.map((u) =>
        u?.uid === updatedUser?.uid ? { ...u, ...updatedUser } : u
      );

      await AsyncStorage.setItem(USERS_ON_DEVICE_KEY, JSON.stringify(nextList));
    } catch (e) {
      console.log("updateUserEverywhereInStorage failed:", e?.message ?? e);
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
        // logout,
        setUserToDB,
        userToDB,
        registerUser,
        authInitializing,
        registerLocalUser,
        comingFrom,
        setComingFrom,
        signOut,
        setPin,
        pin,
        setEmail,
        email,
        loginUser,
        emailError,
        setEmailError,
        generatePinNumberOnDemand,
        firebaseReady,
        firebaseUser,
        isOtherUsers,
        isValidPin,
        reset_pin_1,
        set_Reset_Pin_1,
        reset_pin_2,
        set_Reset_Pin_2,
        handleUpdate,
        finalizePendingEmailChange,
        startEmailChange,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
