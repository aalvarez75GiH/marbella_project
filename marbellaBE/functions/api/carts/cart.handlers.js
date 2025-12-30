/* eslint-disable */
// const getCartByUserID = require("./carts.controllers").getCartByUserID;
// const updateCartByUserUID = require("./carts.controllers");
const cartsControllers = require("./carts.controllers");
const { calculateSubtotal, getTotalCartQuantity } = require("./carts.utils");

const increaseOrDecreaseCartItemQty = async (product, task, user_id) => {
  const cart = await cartsControllers.getCartByUserID(user_id);
  if (!cart) throw new Error("Cart not found");

  const products = cart.products || [];

  const incomingProductId = String(product?.id ?? "");
  const incomingVariantId = String(product?.size_variants?.[0]?.id ?? "");
  const normalizedTask = String(task || "")
    .trim()
    .toLowerCase();

  if (!incomingProductId) throw new Error("Incoming product missing id");
  if (!incomingVariantId)
    throw new Error("Incoming product missing size_variants[0].id");
  if (normalizedTask !== "increase" && normalizedTask !== "decrease") {
    throw new Error(`Task must be 'increase' or 'decrease'. Got: ${task}`);
  }

  // DEBUG
  console.log("incomingProductId:", incomingProductId);
  console.log("incomingVariantId:", incomingVariantId);
  console.log("normalizedTask:", normalizedTask);
  console.log(
    "variants ids per product:",
    products.map((p) => ({
      id: p.id,
      v0: p?.size_variants?.[0]?.id,
      qty0: p?.size_variants?.[0]?.quantity,
    }))
  );

  // ✅ match like your local state logic: product.id + first variant id
  const lineIndex = products.findIndex((p) => {
    const v0 = p?.size_variants?.[0];
    return (
      String(p?.id) === incomingProductId &&
      String(v0?.id) === incomingVariantId
    );
  });

  console.log("lineIndex:", lineIndex);

  let nextProducts = products;

  if (lineIndex === -1) {
    if (normalizedTask === "increase") {
      const v0 = product.size_variants[0];
      nextProducts = [
        ...products,
        { ...product, size_variants: [{ ...v0, quantity: 1 }] },
      ];
    }
  } else {
    nextProducts = products
      .map((p, idx) => {
        if (idx !== lineIndex) return p;

        const v0 = p.size_variants[0];
        const currentQty = Number(v0?.quantity ?? 0);
        // const cap = Number(p?.totalStock ?? Infinity); // or Number(v0?.stock ?? Infinity)
        const cap = Number(v0.stock ?? Infinity); // or Number(v0?.stock ?? Infinity)

        const nextQty =
          normalizedTask === "increase"
            ? Math.min(currentQty + 1, cap)
            : Math.max(currentQty - 1, 0);

        console.log("QTY change:", { currentQty, nextQty, cap });

        const updatedVariant = { ...v0, quantity: nextQty };

        // if hits 0, remove this line item
        if (nextQty <= 0) return null;

        return { ...p, size_variants: [updatedVariant] };
      })
      .filter(Boolean);
  }

  const sub_total = calculateSubtotal(nextProducts);
  const quantity = getTotalCartQuantity(nextProducts);
  const updatedAt = new Date().toISOString();
  const taxes = Number(cart?.taxes ?? 0);
  const total = sub_total + taxes;

  await cartsControllers.updateCartByUserID(user_id, {
    products: nextProducts,
    sub_total,
    quantity,
    updatedAt,
    total,
  });

  // ✅ re-fetch to ensure we return persisted data
  return await cartsControllers.getCartByUserID(user_id);
};

module.exports = {
  calculateSubtotal,
  getTotalCartQuantity,
  increaseOrDecreaseCartItemQty,
};
