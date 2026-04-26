/* eslint-disable */

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

const addImagesPathToVariantsPayload = (product) => {
  const { originCountry, grindType, roast } = product;

  if (
    !Array.isArray(product.size_variants) ||
    product.size_variants.length === 0
  ) {
    const error = new Error("Product has no size_variants");
    error.statusCode = 400;
    throw error;
  }

  return product.size_variants.map((variant) => {
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
};

module.exports = {
  addImagesPathToVariantsPayload,
};
