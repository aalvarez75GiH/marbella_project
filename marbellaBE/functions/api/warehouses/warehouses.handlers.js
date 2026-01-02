/* eslint-disable */

const buildInventoryFromWarehouseProducts = (warehouse_products = []) => {
  const inventory = {};

  for (const product of warehouse_products) {
    const productId = product?.id;
    if (!productId) continue;

    const variants = Array.isArray(product.size_variants)
      ? product.size_variants
      : [];

    for (const variant of variants) {
      const variantId = String(variant?.id ?? "");
      if (!variantId) continue;

      const qty = Number(variant?.qty ?? 0); // default 0
      const sku = `${productId}:${variantId}`;

      inventory[sku] = qty;
    }
  }

  return inventory;
};

module.exports = {
  buildInventoryFromWarehouseProducts,
};
