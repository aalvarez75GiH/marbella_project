import { FLAGS_BY_KEY } from "./flags.maps";
import { IMAGES_BY_KEY } from "./images.map";
import { getImageUrlsFromPaths } from "./storage_images";

export const normalizeProductFromBackend = async (p) => {
  const normalizedFlagKey = String(p?.flag_key ?? "")
    .trim()
    .toLowerCase();

  const flag_image = FLAGS_BY_KEY[normalizedFlagKey] ?? null;

  const size_variants = Array.isArray(p?.size_variants)
    ? await Promise.all(
        p.size_variants.map(async (v) => {
          console.log("RAW VARIANT IN NORMALIZER:", JSON.stringify(v, null, 2));

          const images = Array.isArray(v?.images_path)
            ? await getImageUrlsFromPaths(v.images_path)
            : v.images ?? [];

          console.log("RESOLVED IMAGES FOR VARIANT:", v.sizeLabel, images);

          return {
            ...v,
            images,
          };
        })
      )
    : [];

  return {
    ...p,
    flag_key: normalizedFlagKey || p?.flag_key,
    flag_image,
    size_variants,
  };
};
