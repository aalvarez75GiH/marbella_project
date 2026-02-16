// fb.js
import { initializeApp, getApps } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7fPadDf73WRg1tkQPt7n2H-b5pV8ew70",
  authDomain: "cafe-marbella-be.firebaseapp.com",
  projectId: "cafe-marbella-be",
  storageBucket: "cafe-marbella-be.firebasestorage.app",
  messagingSenderId: "957235778708",
  appId: "1:957235778708:web:091e323e18096833dc5081",
};

export const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

export let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  // ✅ IMPORTANT: initializeAuth FIRST so persistence is applied
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    // If auth is already initialized somewhere else, reuse it
    auth = getAuth(app);
  }
}
