import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../../fb"; // adjust path if needed

export const getImageUrlFromPath = async (path) => {
  if (!path) return null;

  try {
    const imageRef = ref(storage, path);
    return await getDownloadURL(imageRef);
  } catch (error) {
    // console.log("Error getting image URL for path:", path, error);
    return null;
  }
};

export const getImageUrlsFromPaths = async (paths = []) => {
  if (!Array.isArray(paths)) return [];

  const urls = await Promise.all(
    paths.map((path) => getImageUrlFromPath(path))
  );
  return urls.filter(Boolean);
};
