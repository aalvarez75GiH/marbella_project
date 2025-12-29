/* eslint-disable */

const firebase_controller = require("../../fb");

const getCartByUserUID = async (user_id) => {
  let carts = [];
  return await firebase_controller.db
    .collection("carts")
    .where(`user_id`, "==", user_id)
    .get()
    // .then((orders) => orders.data());
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        carts.push(doc.data());
      });
      return carts;
    });
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

    await cartRef.set({ products: updatedProducts }, { merge: true });

    const updatedCartDoc = await cartRef.get();
    console.log("UPDATED CART DOC:", updatedCartDoc.data());
    return updatedCartDoc.data();
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

// const updateProductsCart = async (userId, productToAdd) => {
//   try {
//     const cartRef = firebase_controller.db.collection("carts").doc(userId);
//     const cartDoc = await cartRef.get();

//     const cartData = cartDoc.exists ? cartDoc.data() : null;
//     const existingProducts =
//       cartData && cartData.products ? cartData.products : [];

//     const incoming = productToAdd;
//     const incomingVariant =
//       incoming && incoming.size_variants && incoming.size_variants[0]
//         ? incoming.size_variants[0]
//         : null;

//     if (!incoming || !incoming.id) {
//       throw new Error("Incoming product is missing id");
//     }
//     if (!incomingVariant || !incomingVariant.id) {
//       throw new Error("Incoming product is missing size_variants[0].id");
//     }

//     const incomingProductId = String(incoming.id);
//     const incomingVariantId = String(incomingVariant.id);

//     // EXACT MATCH: product.id AND first variant id
//     const existingIndex = existingProducts.findIndex((p) => {
//       const v0 =
//         p && p.size_variants && p.size_variants[0] ? p.size_variants[0] : null;

//       return (
//         String(p && p.id) === incomingProductId &&
//         String(v0 && v0.id) === incomingVariantId
//       );
//     });

//     let updatedProducts = [];

//     if (existingIndex !== -1) {
//       // If exists → increment quantity on the FIRST variant only
//       updatedProducts = existingProducts.map((p, idx) => {
//         if (idx !== existingIndex) return p;

//         const currentVariant =
//           p && p.size_variants && p.size_variants[0] ? p.size_variants[0] : {};

//         const currentQty =
//           currentVariant.quantity !== undefined &&
//           currentVariant.quantity !== null
//             ? Number(currentVariant.quantity)
//             : 0;

//         const stock =
//           currentVariant.stock !== undefined && currentVariant.stock !== null
//             ? Number(currentVariant.stock)
//             : Infinity;

//         return {
//           ...p,
//           size_variants: [
//             {
//               ...currentVariant,
//               quantity: Math.min(currentQty + 1, stock),
//             },
//           ],
//         };
//       });
//     } else {
//       // If new → add a NEW LINE ITEM (full product) with only that variant qty=1
//       updatedProducts = existingProducts.concat([
//         {
//           ...incoming,
//           size_variants: [
//             {
//               ...incomingVariant,
//               quantity: 1,
//             },
//           ],
//         },
//       ]);
//     }

//     await cartRef.set({ products: updatedProducts }, { merge: true });

//     const updatedCartDoc = await cartRef.get();
//     return updatedCartDoc.exists
//       ? updatedCartDoc.data()
//       : { products: updatedProducts };
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     throw error;
//   }
// };

module.exports = {
  getCartByUserUID,
  createCart,
  updateProductsCart,
};
