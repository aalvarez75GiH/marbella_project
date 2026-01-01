import { FLAGS_BY_KEY } from "./flags.map";
import { IMAGES_BY_KEY } from "./images.map";

export const normalizeProductFromBackend = (p) => {
  const flag_image = FLAGS_BY_KEY[p?.flag_key] ?? null;

  const size_variants = Array.isArray(p?.size_variants)
    ? p.size_variants.map((v) => ({
        ...v,
        // optional: if your UI expects v.images (array of require()’d images)
        images: Array.isArray(v?.image_keys)
          ? v.image_keys.map((k) => IMAGES_BY_KEY[k]).filter(Boolean)
          : v.images ?? [],
      }))
    : [];

  return {
    ...p,
    flag_image,
    size_variants,
  };
};
