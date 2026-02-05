import { IMAGES_BY_KEY } from "./images.map";

export const normalizeCartFromBackend = (cart) => {
  if (!cart) return cart;

  const products = Array.isArray(cart.products)
    ? cart.products.map((p) => ({
        ...p,
        size_variants: Array.isArray(p?.size_variants)
          ? p.size_variants.map((v) => ({
              ...v,
              images: Array.isArray(v?.image_keys)
                ? v.image_keys.map((k) => IMAGES_BY_KEY[k]).filter(Boolean)
                : v.images ?? [],
            }))
          : [],
      }))
    : [];

  return { ...cart, products };
};
