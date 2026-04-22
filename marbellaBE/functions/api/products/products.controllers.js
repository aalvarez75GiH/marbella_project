/* eslint-disable */
const firebase_controller = require("../../fb");

const createProduct = async (product) => {
  if (!product?.id) throw new Error("Product missing id");

  const productId = String(product.id);

  const productRef = firebase_controller.db
    .collection("productsCatalog")
    .doc(productId);

  // 🔍 Check if product already exists
  const existingDoc = await productRef.get();

  if (existingDoc.exists) {
    const error = new Error(`Product with id "${productId}" already exists`);
    error.statusCode = 409;
    throw error;
  }

  const now = new Date().toISOString();

  const payload = {
    ...product,
    createdAt: product.createdAt || now,
    updatedAt: now,
  };

  // ✅ Only create if it does NOT exist
  await productRef.set(payload);

  // ⚠️ NOTE: You were reading from a different collection ("products")
  const snap = await firebase_controller.db
    .collection("productsCatalog")
    .doc(productId)
    .get();

  return snap.data();
};

const bulkCreateProducts = async (products = []) => {
  const batch = firebase_controller.db.batch();
  const now = new Date().toISOString();

  products.forEach((p) => {
    if (!p?.id) throw new Error("One product is missing id");
    const ref = firebase_controller.db.collection("products").doc(String(p.id));
    batch.set(
      ref,
      { ...p, createdAt: p.createdAt || now, updatedAt: now },
      { merge: false }
    );
  });

  await batch.commit();
  return { inserted: products.length };
};

const getProductById = async (id) => {
  const snap = await firebase_controller.db
    .collection("productsCatalog")
    .doc(String(id))
    .get();
  return snap.exists ? snap.data() : null;
};

const getAllProducts = async ({ grindType, originCountry } = {}) => {
  //   let ref = firebase_controller.db.collection("products");
  let ref = firebase_controller.db.collection("productsCatalog");

  // Apply filters ONLY if provided
  if (grindType) {
    ref = ref.where("grindType", "==", grindType);
  }

  if (originCountry) {
    ref = ref.where("originCountry", "==", originCountry);
  }

  const snap = await ref.get();
  return snap.docs.map((doc) => doc.data());
};

const updateProductById = async (id, updates) => {
  const ref = firebase_controller.db
    .collection("productsCatalog")
    .doc(String(id));

  await ref.set(
    { ...updates, updatedAt: new Date().toISOString() },
    { merge: true }
  );

  const snap = await ref.get();
  return snap.exists ? snap.data() : null;
};

/**
 * Build images_path for one variant
 */
const buildImagesPath = ({
  originCountry,
  grindType,
  roast,
  variantSize,
  imageKeys = [],
}) => {
  if (!originCountry || !grindType || !roast || !variantSize) {
    return [];
  }

  return imageKeys.map(
    (fileName) =>
      `${originCountry}/${grindType}/${roast}/${variantSize}/${fileName}`
  );
};
/**
 * Add images_path under every size_variants item for one product
 */
const addImagesPathToProductVariants = async (id) => {
  const ref = firebase_controller.db
    .collection("productsCatalog")
    .doc(String(id));

  const snap = await ref.get();

  if (!snap.exists) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const product = snap.data();

  if (
    !Array.isArray(product.size_variants) ||
    product.size_variants.length === 0
  ) {
    const error = new Error("Product has no size_variants");
    error.statusCode = 400;
    throw error;
  }

  const { originCountry, grindType, roast } = product;

  const updatedVariants = product.size_variants.map((variant) => {
    const variantSize = String(variant.id || variant.sizeGrams);

    return {
      ...variant,
      images_path: buildImagesPath({
        originCountry,
        grindType,
        roast,
        variantSize,
        imageKeys: variant.image_keys || [],
      }),
    };
  });

  await ref.set(
    {
      size_variants: updatedVariants,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  const updatedSnap = await ref.get();
  return updatedSnap.data();
};
const deleteProductById = async (id) => {
  await firebase_controller.db
    .collection("productsCatalog")
    .doc(String(id))
    .delete();
  return { deleted: true, id: String(id) };
};

module.exports = {
  createProduct,
  bulkCreateProducts,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  addImagesPathToProductVariants,
};
