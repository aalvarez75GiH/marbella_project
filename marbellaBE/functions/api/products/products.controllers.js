/* eslint-disable */
const firebase_controller = require("../../fb");

const createProduct = async (product) => {
  if (!product?.id) throw new Error("Product missing id");

  const now = new Date().toISOString();

  const payload = {
    ...product,
    createdAt: product.createdAt || now,
    updatedAt: now,
  };

  await firebase_controller.db
    .collection("productsCatalog")
    .doc(String(product.id))
    .set(payload, { merge: false });

  const snap = await firebase_controller.db
    .collection("products")
    .doc(String(product.id))
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

const deleteProductById = async (id) => {
  await firebase_controller.db.collection("products").doc(String(id)).delete();
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
