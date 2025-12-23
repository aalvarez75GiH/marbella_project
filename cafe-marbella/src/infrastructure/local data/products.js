import VzlaFlag from "../../../assets/flags images/flag_venezuela.svg";
import MexicoFlag from "../../../assets/flags images/flag_mexico.svg";
import HondurasFlag from "../../../assets/flags images/flag_honduras.svg";
import NicaraguaFlag from "../../../assets/flags images/flag_nicaragua.svg";

export const products = [
  /* ============================
         VENEZUELA
      ============================ */
  {
    id: "vzla-medium-whole",
    product_name: "Medium Roast",
    product_subtitle: "Whole Bean Venezuela",
    grindType: "whole",
    originCountry: "Venezuela",
    title: "Cafe Marbella",
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
          require("../../../assets/products_images/vzla_bag_wb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: {
          active: true,
          type: "discount",
          value: 10,
          description: "10% off buying 2 bags!",
        },
      },
      {
        id: "500",
        sizeLabel: "500 gr",
        sizeLabel_ounces: "18 oz",
        sizeGrams: 500,
        price: 15.99,
        images: [
          require("../../../assets/products_images/vzla_bag_wb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: {
          active: true,
          type: "discount",
          value: 10,
          description: "10% off buying 2 bags!",
        },
      },
      {
        id: "1000",
        sizeLabel: "1000 gr",
        sizeLabel_ounces: "36 oz",
        sizeGrams: 1000,
        price: 29.99,
        images: [
          require("../../../assets/products_images/vzla_bag_wb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: {
          active: true,
          type: "discount",
          value: 10,
          description: "10% off buying 2 bags!",
        },
      },
    ],
  },

  {
    id: "vzla-medium-ground",
    product_name: "Medium Roast",
    product_subtitle: "Ground Bean Venezuela",
    grindType: "ground",
    originCountry: "Venezuela",
    title: "Cafe Marbella",
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
        promotion: { active: false },
      },
      {
        id: "500",
        sizeLabel: "500 gr",
        sizeLabel_ounces: "18 oz",
        sizeGrams: 500,
        price: 15.99,
        images: [
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: {
          active: true,
          type: "discount",
          value: 10,
          description: "Time limited: 10% off buying 2 bags!",
        },
      },
      {
        id: "1000",
        sizeLabel: "1000 gr",
        sizeLabel_ounces: "36 oz",
        sizeGrams: 1000,
        price: 29.99,
        images: [
          require("../../../assets/products_images/vzla_bag_gb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: {
          active: true,
          type: "discount",
          value: 10,
          description: "Time limited: 10% off buying 2 bags!",
        },
      },
    ],
  },

  /* ============================
         MEXICO
      ============================ */
  {
    id: "mex-medium-whole",
    product_name: "Medium Roast",
    product_subtitle: "Whole Bean Mexico",
    grindType: "whole",
    originCountry: "México",
    title: "Cafe Marbella",
    description:
      "Sourced from Mexico's finest coffee-growing regions, this dark roast offers a bold flavor profile with hints of dark chocolate and a smoky finish.",
    rating: 4.6,
    flag_image: MexicoFlag,

    size_variants: [
      {
        id: "250",
        sizeLabel: "250 gr",
        sizeLabel_ounces: "9 oz",
        sizeGrams: 250,
        price: 9.49,
        isDefault: true,
        images: [
          require("../../../assets/products_images/mexico_bag_wb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: { active: true, type: "discount", value: 10 },
      },
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
        promotion: { active: true, type: "discount", value: 10 },
      },
      {
        id: "1000",
        sizeLabel: "1000 gr",
        sizeLabel_ounces: "36 oz",
        sizeGrams: 1000,
        price: 31.99,
        images: [
          require("../../../assets/products_images/mexico_bag_wb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: { active: true, type: "discount", value: 10 },
      },
    ],
  },

  {
    id: "mex-medium-ground",
    product_name: "Medium Roast",
    product_subtitle: "Ground Bean Mexico",
    grindType: "ground",
    originCountry: "México",
    title: "Cafe Marbella",
    description:
      "Sourced from Mexico's finest coffee-growing regions, this dark roast offers a bold flavor profile with hints of dark chocolate and a smoky finish.",
    rating: 4.6,
    flag_image: MexicoFlag,

    size_variants: [
      {
        id: "250",
        sizeLabel: "250 gr",
        sizeLabel_ounces: "9 oz",
        sizeGrams: 250,
        price: 9.49,
        isDefault: true,
        images: [
          require("../../../assets/products_images/mexico_bag_gb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: { active: false },
      },
      {
        id: "500",
        sizeLabel: "500 gr",
        sizeLabel_ounces: "18 oz",
        sizeGrams: 500,
        price: 16.99,
        images: [
          require("../../../assets/products_images/mexico_bag_gb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: { active: false },
      },
      {
        id: "1000",
        sizeLabel: "1000 gr",
        sizeLabel_ounces: "36 oz",
        sizeGrams: 1000,
        price: 31.99,
        images: [
          require("../../../assets/products_images/mexico_bag_gb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: { active: false },
      },
    ],
  },
  /* ============================
       HONDURAS
    ============================ */
  {
    id: "hnd-medium-whole",
    product_name: "Medium Roast",
    product_subtitle: "Whole Bean Honduras",
    grindType: "whole",
    originCountry: "Hondúras",
    title: "Cafe Marbella",
    description:
      "Grown in the fertile lands of Honduras, our coffee offers a bright acidity with hints of citrus and nuts.",
    rating: 4.9,
    flag_image: HondurasFlag,

    size_variants: [
      {
        id: "250",
        sizeLabel: "250 gr",
        sizeLabel_ounces: "9 oz",
        sizeGrams: 250,
        price: 9.49,
        isDefault: true,
        images: [
          require("../../../assets/products_images/honduras_bag_wb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: {
          active: true,
          type: "discount",
          value: 10,
          description: "10% off buying 2 bags!",
        },
      },
      {
        id: "500",
        sizeLabel: "500 gr",
        sizeLabel_ounces: "18 oz",
        sizeGrams: 500,
        price: 16.99,
        images: [
          require("../../../assets/products_images/honduras_bag_wb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: {
          active: true,
          type: "discount",
          value: 10,
          description: "10% off buying 2 bags!",
        },
      },
      {
        id: "1000",
        sizeLabel: "1000 gr",
        sizeLabel_ounces: "36 oz",
        sizeGrams: 1000,
        price: 31.99,
        images: [
          require("../../../assets/products_images/honduras_bag_wb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: {
          active: true,
          type: "discount",
          value: 10,
          description: "10% off buying 2 bags!",
        },
      },
    ],
  },

  {
    id: "hnd-medium-ground",
    product_name: "Medium Roast",
    product_subtitle: "Ground Bean Honduras",
    grindType: "ground",
    originCountry: "Hondúras",
    title: "Cafe Marbella",
    description:
      "Grown in the fertile lands of Honduras, our coffee offers a bright acidity with hints of citrus and nuts.",
    rating: 4.9,
    flag_image: HondurasFlag,

    size_variants: [
      {
        id: "250",
        sizeLabel: "250 gr",
        sizeLabel_ounces: "9 oz",
        sizeGrams: 250,
        price: 9.49,
        isDefault: true,
        images: [
          require("../../../assets/products_images/honduras_bag_gb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: { active: false },
      },
      {
        id: "500",
        sizeLabel: "500 gr",
        sizeLabel_ounces: "18 oz",
        sizeGrams: 500,
        price: 16.99,
        images: [
          require("../../../assets/products_images/honduras_bag_gb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: { active: false },
      },
      {
        id: "1000",
        sizeLabel: "1000 gr",
        sizeLabel_ounces: "36 oz",
        sizeGrams: 1000,
        price: 31.99,
        images: [
          require("../../../assets/products_images/honduras_bag_gb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: { active: false },
      },
    ],
  },

  /* ============================
       NICARAGUA
    ============================ */
  {
    id: "nic-medium-whole",
    product_name: "Medium Roast",
    product_subtitle: "Whole Bean Nicaragua",
    grindType: "whole",
    originCountry: "Nicaragua",
    title: "Cafe Marbella",
    description:
      "From the volcanic slopes of Nicaragua, our coffee presents a complex profile with notes of cocoa and red fruit.",
    rating: 5.0,
    flag_image: NicaraguaFlag,

    size_variants: [
      {
        id: "250",
        sizeLabel: "250 gr",
        sizeLabel_ounces: "9 oz",
        sizeGrams: 250,
        price: 9.49,
        isDefault: true,
        images: [
          require("../../../assets/products_images/nicaragua_bag_wb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: {
          active: true,
          type: "discount",
          value: 10,
          description: "10% off buying 2 bags!",
        },
      },
      {
        id: "500",
        sizeLabel: "500 gr",
        sizeLabel_ounces: "18 oz",
        sizeGrams: 500,
        price: 16.99,
        images: [
          require("../../../assets/products_images/nicaragua_bag_wb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: {
          active: true,
          type: "discount",
          value: 10,
          description: "10% off buying 2 bags!",
        },
      },
      {
        id: "1000",
        sizeLabel: "1000 gr",
        sizeLabel_ounces: "36 oz",
        sizeGrams: 1000,
        price: 31.99,
        images: [
          require("../../../assets/products_images/nicaragua_bag_wb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: {
          active: true,
          type: "discount",
          value: 10,
          description: "10% off buying 2 bags!",
        },
      },
    ],
  },

  {
    id: "nic-medium-ground",
    product_name: "Medium Roast",
    product_subtitle: "Ground Bean Nicaragua",
    grindType: "ground",
    originCountry: "Nicaragua",
    title: "Cafe Marbella",
    description:
      "From the volcanic slopes of Nicaragua, our coffee presents a complex profile with notes of cocoa and red fruit.",
    rating: 5.0,
    flag_image: NicaraguaFlag,

    size_variants: [
      {
        id: "250",
        sizeLabel: "250 gr",
        sizeLabel_ounces: "9 oz",
        sizeGrams: 250,
        price: 9.49,
        isDefault: true,
        images: [
          require("../../../assets/products_images/nicaragua_bag_gb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: { active: false },
      },
      {
        id: "500",
        sizeLabel: "500 gr",
        sizeLabel_ounces: "18 oz",
        sizeGrams: 500,
        price: 16.99,
        images: [
          require("../../../assets/products_images/nicaragua_bag_gb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: { active: false },
      },
      {
        id: "1000",
        sizeLabel: "1000 gr",
        sizeLabel_ounces: "36 oz",
        sizeGrams: 1000,
        price: 31.99,
        images: [
          require("../../../assets/products_images/nicaragua_bag_gb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
        promotion: { active: false },
      },
    ],
  },
];

// export const whole_bean_coffee = [
//   {
//     id: 1,
//     product_name: "Medium Roast",
//     product_subtitle: "Whole Bean Venezuela",
//     cart_product_name: "Cafe Marbella",
//     cart_product_country_name: "Venezuela",
//     cart_product_description: "Whole bean coffee",

//     description:
//       "From the high mountains of the Andes, our Venezuelan coffee boasts a rich aroma with delicate notes of chocolate and caramel. A smooth, balanced cup that embodies the essence of our heritage.",
//     rating: 4.8,
//     flag_image: VzlaFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeLabel_ounces: "9 oz",
//         sizeGrams: 250,
//         price: 8.99,
//         isDefault: true,
//         images: [
//           require("../../../assets/products_images/vzla_bag_wb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 1,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeLabel_ounces: "18 oz",
//         sizeGrams: 500,
//         price: 15.99,
//         images: [
//           require("../../../assets/products_images/vzla_bag_wb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 1,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "1000",
//         sizeLabel: "1000 gr",
//         sizeLabel_ounces: "36 oz",
//         sizeGrams: 1000,
//         price: 29.99,
//         images: [
//           require("../../../assets/products_images/vzla_bag_wb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 1,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//     ],
//   },

//   {
//     id: 2,
//     product_name: "Medium Roast",
//     product_subtitle: "Whole Bean Mexico",
//     cart_product_name: "Cafe Marbella",
//     cart_product_country_name: "México",
//     cart_product_description: "Whole bean coffee",
//     description:
//       "Sourced from Mexico's finest coffee-growing regions, this dark roast offers a bold flavor profile with hints of dark chocolate and a smoky finish. Perfect for those who crave a robust cup.",
//     rating: 4.6,
//     flag_image: MexicoFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeLabel_ounces: "9 oz",
//         sizeGrams: 250,
//         price: 9.49,
//         isDefault: true,
//         images: [
//           require("../../../assets/products_images/mexico_bag_wb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 1,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeLabel_ounces: "18 oz",
//         sizeGrams: 500,
//         price: 16.99,
//         images: [
//           require("../../../assets/products_images/mexico_bag_wb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 1,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "1000",
//         sizeLabel: "1000 gr",
//         sizeLabel_ounces: "36 oz",
//         sizeGrams: 1000,
//         price: 31.99,
//         images: [
//           require("../../../assets/products_images/mexico_bag_wb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 1,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//     ],
//   },

//   {
//     id: 3,
//     product_name: "Medium Roast",
//     product_subtitle: "Whole Bean Honduras",
//     cart_product_name: "Cafe Marbella",
//     cart_product_country_name: "Hondúras",
//     cart_product_description: "Whole bean coffee",
//     description:
//       "Grown in the fertile lands of Honduras, our coffee offers a bright acidity with hints of citrus and nuts.",
//     rating: 4.9,
//     flag_image: HondurasFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeLabel_ounces: "9 oz",
//         sizeGrams: 250,
//         price: 9.49,
//         isDefault: true,
//         images: [
//           require("../../../assets/products_images/honduras_bag_wb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 1,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeLabel_ounces: "18 oz",
//         sizeGrams: 500,
//         price: 16.99,
//         images: [
//           require("../../../assets/products_images/honduras_bag_wb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 1,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "1000",
//         sizeLabel: "1000 gr",
//         sizeLabel_ounces: "36 oz",
//         sizeGrams: 1000,
//         price: 31.99,
//         images: [
//           require("../../../assets/products_images/honduras_bag_wb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 1,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//     ],
//   },

//   {
//     id: 4,
//     product_name: "Medium Roast",
//     product_subtitle: "Whole Bean Nicaragua",
//     cart_product_name: "Cafe Marbella",
//     cart_product_country_name: "Nicaragua",
//     cart_product_description: "Whole bean coffee",
//     description:
//       "From the volcanic slopes of Nicaragua, our coffee presents a complex profile with notes of cocoa and red fruit.",
//     rating: 5.0,
//     flag_image: NicaraguaFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeLabel_ounces: "9 oz",
//         sizeGrams: 250,
//         price: 9.49,
//         isDefault: true,
//         images: [
//           require("../../../assets/products_images/nicaragua_bag_wb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 1,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeLabel_ounces: "18 oz",
//         sizeGrams: 500,
//         price: 16.99,
//         images: [
//           require("../../../assets/products_images/nicaragua_bag_wb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 1,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "1000",
//         sizeLabel: "1000 gr",
//         sizeLabel_ounces: "36 oz",
//         sizeGrams: 1000,
//         price: 31.99,
//         images: [
//           require("../../../assets/products_images/nicaragua_bag_wb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 1,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//     ],
//   },
// ];

// export const ground_bean_coffee = [
//   {
//     id: 1,
//     product_name: "Medium Roast",
//     product_subtitle: "Ground Bean Venezuela",
//     cart_product_name: "Cafe Marbella",
//     cart_product_country_name: "Venezuela",
//     cart_product_description: "Ground bean coffee",
//     description:
//       "From the high mountains of the Andes, our Venezuelan coffee boasts a rich aroma with delicate notes of chocolate and caramel. A smooth, balanced cup that embodies the essence of our heritage.",
//     rating: 4.8,
//     flag_image: VzlaFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeLabel_ounces: "9 oz",
//         sizeGrams: 250,
//         price: 8.99,
//         isDefault: true,
//         images: [
//           require("../../../assets/products_images/vzla_bag_gb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 3,
//         promotion: {
//           active: false,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeLabel_ounces: "18 oz",
//         sizeGrams: 500,
//         price: 15.99,
//         images: [
//           //   require("../../../assets/products_images/vzla_bag_gb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 11,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "Time limited: 10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "1000",
//         sizeLabel: "1000 gr",
//         sizeLabel_ounces: "36 oz",
//         sizeGrams: 1000,
//         price: 29.99,
//         images: [
//           require("../../../assets/products_images/vzla_bag_gb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 10,
//         promotion: {
//           active: true,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "Time limited: 10% off buying 2 bags!",
//         },
//       },
//     ],
//   },

//   {
//     id: 2,
//     product_name: "Medium Roast",
//     product_subtitle: "Ground Bean Mexico",
//     cart_product_name: "Cafe Marbella",
//     cart_product_country_name: "México",
//     cart_product_description: "Ground bean coffee",
//     description:
//       "Sourced from Mexico's finest coffee-growing regions, this dark roast offers a bold flavor profile with hints of dark chocolate and a smoky finish. Perfect for those who crave a robust cup.",
//     rating: 4.6,
//     flag_image: MexicoFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeLabel_ounces: "9 oz",
//         sizeGrams: 250,
//         price: 9.49,
//         isDefault: true,
//         images: [
//           require("../../../assets/products_images/mexico_bag_gb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 6,
//         promotion: {
//           active: false,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeLabel_ounces: "18 oz",
//         sizeGrams: 500,
//         price: 16.99,
//         images: [
//           require("../../../assets/products_images/mexico_bag_gb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 2,
//         promotion: {
//           active: false,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "1000",
//         sizeLabel: "1000 gr",
//         sizeLabel_ounces: "36 oz",
//         sizeGrams: 1000,
//         price: 31.99,
//         images: [
//           require("../../../assets/products_images/mexico_bag_gb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         quantity: 11,
//         promotion: {
//           active: false,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//     ],
//   },

//   {
//     id: 3,
//     product_name: "Medium Roast",
//     product_subtitle: "Ground Bean Honduras",
//     cart_product_name: "Cafe Marbella",
//     cart_product_country_name: "Hondúras",
//     cart_product_description: "Ground bean coffee",
//     description:
//       "Grown in the fertile lands of Honduras, our coffee offers a bright acidity with hints of citrus and nuts.",
//     rating: 4.9,
//     flag_image: HondurasFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeLabel_ounces: "9 oz",
//         sizeGrams: 250,
//         price: 9.49,
//         isDefault: true,
//         images: [
//           require("../../../assets/products_images/honduras_bag_gb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 8,
//         promotion: {
//           active: false,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeLabel_ounces: "18 oz",
//         sizeGrams: 500,
//         price: 16.99,
//         images: [
//           require("../../../assets/products_images/honduras_bag_gb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         quantity: 2,
//         promotion: {
//           active: false,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "1000",
//         sizeLabel: "1000 gr",
//         sizeLabel_ounces: "36 oz",
//         sizeGrams: 1000,
//         price: 31.99,
//         images: [
//           require("../../../assets/products_images/honduras_bag_gb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 2,
//         promotion: {
//           active: false,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//     ],
//   },

//   {
//     id: 4,
//     product_name: "Medium Roast",
//     product_subtitle: "Ground Bean Nicaragua",
//     cart_product_name: "Cafe Marbella",
//     cart_product_country_name: "Nicaragua",
//     cart_product_description: "Ground bean coffee",
//     description:
//       "From the volcanic slopes of Nicaragua, our coffee presents a complex profile with notes of cocoa and red fruit.",
//     rating: 5.0,
//     flag_image: NicaraguaFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeLabel_ounces: "9 oz",
//         sizeGrams: 250,
//         price: 9.49,
//         isDefault: true,
//         images: [
//           require("../../../assets/products_images/nicaragua_bag_gb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 1,
//         promotion: {
//           active: false,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeLabel_ounces: "18 oz",
//         sizeGrams: 500,
//         price: 16.99,
//         images: [
//           require("../../../assets/products_images/nicaragua_bag_gb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 10,
//         promotion: {
//           active: false,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//       {
//         id: "1000",
//         sizeLabel: "1000 gr",
//         sizeLabel_ounces: "36 oz",
//         sizeGrams: 1000,
//         price: 31.99,
//         images: [
//           require("../../../assets/products_images/nicaragua_bag_gb.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//           require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//           require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//         ],
//         stock: 11,
//         promotion: {
//           active: false,
//           type: "discount",
//           value: 10, // 10% discount
//           description: "10% off buying 2 bags!",
//         },
//       },
//     ],
//   },
// ];
