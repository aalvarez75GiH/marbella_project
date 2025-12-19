import VzlaFlag from "../../../assets/flags images/flag_venezuela.svg";
import MexicoFlag from "../../../assets/flags images/flag_mexico.svg";
import HondurasFlag from "../../../assets/flags images/flag_honduras.svg";
import NicaraguaFlag from "../../../assets/flags images/flag_nicaragua.svg";

export const shopping_cart = {
  user_id: "user_1",
  cart_id: "cart_1",
  created_at: "2025-12-17T10:00:00Z",
  updated_at: "2025-12-17T12:00:00Z",
  products: [],
  sub_total: 0,
  taxes: 0,
  total: 0,
};

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
        cart_product_name: "Cafe Marbella",
        cart_product_country_name: "Venezuela",
        cart_product_description: "Ground bean coffee",
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
            quantity: 1,
            promotion: {
              active: false,
              type: "discount",
              value: 10, // 10% discount
              description: "10% off buying 2 bags!",
            },
          },
        ],
      },
      {
        id: 2,
        product_name: "Medium Roast",
        product_subtitle: "Whole Bean Mexico",
        description:
          "Sourced from Mexico's finest coffee-growing regions, this dark roast offers a bold flavor profile with hints of dark chocolate and a smoky finish. Perfect for those who crave a robust cup.",
        rating: 4.6,
        flag_image: MexicoFlag,
        cart_product_name: "Cafe Marbella",
        cart_product_country_name: "Mexico",
        cart_product_description: "Whole bean coffee",
        size_variants: [
          {
            id: "500",
            sizeLabel: "500 gr",
            sizeLabel_ounces: "18 oz",
            sizeGrams: 500,
            price: 16.99,
            images: [
              require("../../../assets/products_images/mexico_bag_wb.png"),
              require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
              require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
              require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
            ],
            quantity: 1,
            promotion: {
              active: true,
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
