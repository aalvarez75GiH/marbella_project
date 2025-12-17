import { create } from "react-native/types_generated/Libraries/ReactNative/ReactFabricPublicInstance/ReactNativeAttributePayload";

export const shopping_carts = [
  {
    user_id: "user_1",
    created_at: "2025-12-17T10:00:00Z",
    updated_at: "2025-12-17T12:00:00Z",
    products: [
      {
        id: 1,
        product_name: "Medium Roast",
        product_subtitle: "Ground Bean Venezuela",
        description:
          "From the high mountains of the Andes, our Venezuelan coffee boasts a rich aroma with delicate notes of chocolate and caramel. A smooth, balanced cup that embodies the essence of our heritage.",
        rating: 4.8,
        flag_image: VzlaFlag,
        size_variants: [
          {
            id: "250",
            sizeLabel: "250 gr",
            sizeLabel_ounces: "9 oz",
            sizeGrams: 250,
            price: 8.99,
            isDefault: true,
            images: [
              require("../../../assets/products_images/vzla_bag_gb.png"),
              require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
              require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
              require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
            ],
            quantity: 3,
            promotion: {
              active: false,
              type: "discount",
              value: 10, // 10% discount
              description: "10% off buying 2 bags!",
            },
          },
        ],
      },
    ],
  },
];
