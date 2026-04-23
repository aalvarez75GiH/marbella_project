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
          let images = [];

          // 1. Best long-term option
          if (Array.isArray(v?.images_urls) && v.images_urls.length > 0) {
            images = v.images_urls;
          }

          // 2. Storage-path migration option
          else if (Array.isArray(v?.images_path) && v.images_path.length > 0) {
            images = await getImageUrlsFromPaths(v.images_path);
          }

          // 3. Legacy local-assets fallback
          else if (Array.isArray(v?.image_keys) && v.image_keys.length > 0) {
            images = v.image_keys.map((k) => IMAGES_BY_KEY[k]).filter(Boolean);
          }

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

// import { FLAGS_BY_KEY } from "./flags.maps";
// import { getImageUrlsFromPaths } from "./storage_images";

// export const normalizeProductFromBackend = async (p) => {
//   const normalizedFlagKey = String(p?.flag_key ?? "")
//     .trim()
//     .toLowerCase();

//   const flag_image = FLAGS_BY_KEY[normalizedFlagKey] ?? null;

//   const size_variants = Array.isArray(p?.size_variants)
//     ? await Promise.all(
//         p.size_variants.map(async (v) => {
//           let images = [];

//           // ✅ 1. FAST PATH (best)
//           if (Array.isArray(v?.images_urls) && v.images_urls.length > 0) {
//             images = v.images_urls;
//           }

//           // 🟡 2. FALLBACK (temporary during migration)
//           else if (Array.isArray(v?.images_path)) {
//             images = await getImageUrlsFromPaths(v.images_path);
//           }

//           // 🔴 3. LEGACY (old local images)
//           else if (Array.isArray(v?.image_keys)) {
//             // keep your old mapping here if needed
//           }

//           return {
//             ...v,
//             images,
//           };
//         })
//       )
//     : [];

//   return {
//     ...p,
//     flag_key: normalizedFlagKey || p?.flag_key,
//     flag_image,
//     size_variants,
//   };
// };

// import { FLAGS_BY_KEY } from "./flags.maps";
// import { IMAGES_BY_KEY } from "./images.map";
// import { getImageUrlsFromPaths } from "./storage_images";

// export const normalizeProductFromBackend = async (p) => {
//   const normalizedFlagKey = String(p?.flag_key ?? "")
//     .trim()
//     .toLowerCase();

//   const flag_image = FLAGS_BY_KEY[normalizedFlagKey] ?? null;

//   const size_variants = Array.isArray(p?.size_variants)
//     ? await Promise.all(
//         p.size_variants.map(async (v) => {
//           console.log("RAW VARIANT IN NORMALIZER:", JSON.stringify(v, null, 2));

//           const images = Array.isArray(v?.images_path)
//             ? await getImageUrlsFromPaths(v.images_path)
//             : v.images ?? [];

//           console.log("RESOLVED IMAGES FOR VARIANT:", v.sizeLabel, images);

//           return {
//             ...v,
//             images,
//           };
//         })
//       )
//     : [];

//   return {
//     ...p,
//     flag_key: normalizedFlagKey || p?.flag_key,
//     flag_image,
//     size_variants,
//   };
// };
