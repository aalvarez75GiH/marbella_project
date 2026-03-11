import forge from "node-forge";

export const STORAGE_KEYS = {
  CURRENT_USER_KEY: "@marbella/current_user",
  USERS_ON_DEVICE_KEY: "@marbella/users_on_device",
  GUEST_CART_KEY: "@marbella/guest_cart",
};

const PUBLIC_KEY_PEM = process.env.EXPO_PUBLIC_PUBLIC_KEY_PEM;

export function encryptPinWithServerPublicKey(pin) {
  if (typeof pin !== "string") throw new Error("PIN must be a string");

  const publicKey = forge.pki.publicKeyFromPem(PUBLIC_KEY_PEM);

  const encryptedBytes = publicKey.encrypt(pin, "RSA-OAEP", {
    md: forge.md.sha256.create(),
    mgf1: { md: forge.md.sha256.create() },
  });

  return forge.util.encode64(encryptedBytes);
}
