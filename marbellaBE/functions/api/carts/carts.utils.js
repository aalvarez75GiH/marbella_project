/* eslint-disable */

const calculateSubtotal = (products = []) => {
  return products.reduce((sum, p) => {
    const variants = Array.isArray(p?.size_variants) ? p.size_variants : [];
    return (
      sum +
      variants.reduce((vSum, v) => {
        const price = Number(v?.price ?? 0);
        const qty = Number(v?.quantity ?? 0);
        return vSum + price * qty;
      }, 0)
    );
  }, 0);
};

const getTotalCartQuantity = (products = []) => {
  return products.reduce((sum, p) => {
    const variants = Array.isArray(p?.size_variants) ? p.size_variants : [];
    return (
      sum + variants.reduce((vSum, v) => vSum + Number(v?.quantity ?? 0), 0)
    );
  }, 0);
};

module.exports = { calculateSubtotal, getTotalCartQuantity };
