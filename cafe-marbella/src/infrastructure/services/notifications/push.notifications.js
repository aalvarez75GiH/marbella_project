import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../fb";

// This function registers the device for push notifications and returns the Expo push token.
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log("Push notifications require a physical device");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Push notification permission not granted");
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    console.log("Missing EAS projectId for Expo push token");
    return null;
  }

  const tokenResponse = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return tokenResponse.data;
}

// This function saves the Expo push token to the user's Firestore document.
export async function saveExpoPushTokenToUser({ uid, token }) {
  if (!uid || !token) return;

  const q = query(collection(db, "users"), where("uid", "==", uid));
  const snap = await getDocs(q);

  console.log("PUSH SAVE -> query empty?", snap.empty);
  console.log("PUSH SAVE -> docs found:", snap.docs.length);

  if (snap.empty) {
    throw new Error(`No user document found with uid: ${uid}`);
  }

  const userDoc = snap.docs[0];
  const userData = userDoc.data();

  console.log("PUSH SAVE -> firestore doc id:", userDoc.id);

  const currentTokens = Array.isArray(userData?.expo_push_tokens)
    ? userData.expo_push_tokens
    : [];

  const alreadyExists = currentTokens.some((item) => item?.token === token);

  const nextTokens = alreadyExists
    ? currentTokens.map((item) =>
        item?.token === token
          ? {
              ...item,
              platform: Platform.OS,
              active: true,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    : [
        ...currentTokens,
        {
          token,
          platform: Platform.OS,
          active: true,
          updatedAt: new Date().toISOString(),
        },
      ];

  console.log("PUSH SAVE -> about to update user doc");

  await updateDoc(userDoc.ref, {
    expo_push_tokens: nextTokens,
    updatedAt: new Date().toISOString(),
  });

  console.log("PUSH SAVE -> success");
}
