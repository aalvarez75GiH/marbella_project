import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

const CART_KEY = "@marbella/guest_cart";

const emptyCart = () => ({
  cart_id: uuidv4(),
  products: [],
  sub_total: 0,
  taxes: 0,
  total: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const getGuestCart = async () => {
  const raw = await AsyncStorage.getItem(CART_KEY);
  if (!raw) {
    const fresh = emptyCart();
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(fresh));
    return fresh;
  }
  return JSON.parse(raw);
};
export const calcSubTotal = (products = []) =>
  products.reduce(
    (sum, p) => sum + (p.price_cents || 0) * (p.quantity || 0),
    0
  );

export const calcTotals = (cart) => {
  const sub_total = calcSubTotal(cart.products);
  const taxes = cart.taxes || 0; // you can compute later
  const total = sub_total + taxes;
  return { ...cart, sub_total, taxes, total };
};

export const setGuestCart = async (cart) => {
  const next = { ...cart, updatedAt: new Date().toISOString() };
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(next));
  return next;
};

export const clearGuestCart = async () => {
  await AsyncStorage.removeItem(CART_KEY);
};
