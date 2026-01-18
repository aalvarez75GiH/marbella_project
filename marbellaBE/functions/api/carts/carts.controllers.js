/* eslint-disable */

const firebase_controller = require("../../fb");
const { calculateSubtotal, getTotalCartQuantity } = require("./carts.utils");

const getCartByUserID = async (user_id) => {
  const ref = firebase_controller.db.collection("carts").doc(user_id);
  const snap = await ref.get();
  console.log("[getCartByUserUID] docId:", user_id, "exists:", snap.exists);
  return snap.exists ? snap.data() : null;
};

const updateCartByDocId = async (docId, payload) => {
  await firebase_controller.db
    .collection("carts")
    .doc(docId)
    .set(payload, { merge: true });
};

const updateCartByUserID = async (user_id, payload) => {
  console.log("[updateCartByUserUID] writing docId:", user_id);
  await firebase_controller.db
    .collection("carts")
    .doc(user_id)
    .set(payload, { merge: true });
};

const createCart = async (cart) => {
  const {
    user_id,
    cart_id,
    createdAt,
    updatedAt,
    products,
    sub_total,
    taxes,
    total,
  } = cart;
  await firebase_controller.db.collection("carts").doc(user_id).create({
    user_id,
    cart_id,
    createdAt,
    updatedAt,
    products,
    sub_total,
    taxes,
    total,
  });
  let newCart = [];
  return await firebase_controller.db
    .collection("carts")
    .where(`cart_id`, "==", cart_id)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        newCart.push(doc.data());
      });
      console.log("NEW USER:", newCart);
      return newCart;
    });
};

const updateProductsCart = async (user_id, product) => {
  try {
    const cartRef = firebase_controller.db.collection("carts").doc(user_id);
    const cartDoc = await cartRef.get();

    const existingProducts = cartDoc.exists
      ? cartDoc.data()?.products || []
      : [];

    const incomingVariant = product?.size_variants?.[0];
    if (!incomingVariant?.id) {
      throw new Error("Incoming product is missing size_variants[0].id");
    }

    const incomingProductId = String(product.id);
    const incomingVariantId = String(incomingVariant.id);

    // ✅ Find the cart entry that matches product id AND contains the same variant id
    const matchingEntryIndex = existingProducts.findIndex((p) => {
      if (String(p?.id) !== incomingProductId) return false;
      return (p?.size_variants || []).some(
        (v) => String(v?.id) === incomingVariantId
      );
    });

    let updatedProducts;

    if (matchingEntryIndex !== -1) {
      // ✅ Increment quantity on that exact variant in that exact cart entry
      updatedProducts = existingProducts.map((p, idx) => {
        if (idx !== matchingEntryIndex) return p;

        return {
          ...p,
          size_variants: (p.size_variants || []).map((v) => {
            if (String(v?.id) !== incomingVariantId) return v;

            const currentQty = Number(v.quantity ?? 0);
            const stock = Number(v.stock ?? Infinity);

            return {
              ...v,
              quantity: Math.min(currentQty + 1, stock),
            };
          }),
        };
      });
    } else {
      // ✅ No cart entry found with same product+variant -> add FULL product as new entry
      updatedProducts = [...existingProducts, product];
    }
    // ✅ derive totals on backend

    const sub_total = calculateSubtotal(updatedProducts);
    const quantity = getTotalCartQuantity(updatedProducts);
    const updatedAt = new Date().toISOString();

    // await cartRef.set({ products: updatedProducts }, { merge: true });
    await cartRef.set(
      {
        products: updatedProducts,
        sub_total,
        quantity,
        // taxes,
        // total,
        updatedAt,
      },
      { merge: true }
    );

    const updatedCartDoc = await cartRef.get();
    console.log("UPDATED CART DOC:", updatedCartDoc.data());
    return updatedCartDoc.data();
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

const resetCartByUserID = async (user_id) => {
  if (!user_id) throw new Error("user_id is required to reset cart");

  const cartRef = firebase_controller.db.collection("carts").doc(user_id);
  const snap = await cartRef.get();

  if (!snap.exists) {
    // If you prefer: return null; or create an empty cart doc instead.
    throw new Error(`Cart not found for user_id: ${user_id}`);
  }

  const resetPayload = {
    products: [],
    sub_total: 0,
    taxes: 0,
    total: 0,
    quantity: 0,
    updatedAt: new Date().toISOString(),
  };

  await cartRef.set(resetPayload, { merge: true });

  const updatedSnap = await cartRef.get();
  return updatedSnap.data();
};

module.exports = {
  getCartByUserID,
  createCart,
  updateProductsCart,
  updateCartByDocId,
  updateCartByUserID,
  resetCartByUserID,
};
