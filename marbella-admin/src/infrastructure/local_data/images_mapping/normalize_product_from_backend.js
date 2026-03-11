import { FLAGS_BY_KEY } from "./flags.maps";
import { IMAGES_BY_KEY } from "./images.map";

export const normalizeProductFromBackend = (p) => {
  // ✅ normalize flag_key (handles "HND", "hnd ", etc.)
  const normalizedFlagKey = String(p?.flag_key ?? "")
    .trim()
    .toLowerCase();

  const flag_image = FLAGS_BY_KEY[normalizedFlagKey] ?? null;

  const size_variants = Array.isArray(p?.size_variants)
    ? p.size_variants.map((v) => ({
        ...v,
        // ✅ ensure v.images exists (mapped from image_keys if present)
        images: Array.isArray(v?.image_keys)
          ? v.image_keys.map((k) => IMAGES_BY_KEY[k]).filter(Boolean)
          : v.images ?? [],
      }))
    : [];

  return {
    ...p,
    // optional: keep normalized key if you want (helps debugging)
    flag_key: normalizedFlagKey || p?.flag_key,
    flag_image,
    size_variants,
  };
};
