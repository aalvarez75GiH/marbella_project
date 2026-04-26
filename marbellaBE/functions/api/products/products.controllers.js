/* eslint-disable */
const firebase_controller = require("../../fb");
const { addImagesPathToVariantsPayload } = require("./products.handlers");

const createProduct = async (product) => {
  if (!product?.id) throw new Error("Product missing id");

  const productId = String(product.id);

  const productRef = firebase_controller.db
    .collection("productsCatalog")
    .doc(productId);

  const existingDoc = await productRef.get();

  if (existingDoc.exists) {
    const error = new Error(`Product with id "${productId}" already exists`);
    error.statusCode = 409;
    throw error;
  }

  const now = new Date().toISOString();

  const size_variants = addImagesPathToVariantsPayload(product);

  const payload = {
    ...product,
    size_variants,
    createdAt: product.createdAt || now,
    updatedAt: now,
  };

  await productRef.set(payload);

  const snap = await productRef.get();

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
};
