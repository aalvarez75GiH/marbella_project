import VzlaFlag from "../../../assets/flags images/flag_venezuela.svg";
import MexicoFlag from "../../../assets/flags images/flag_mexico.svg";
import HondurasFlag from "../../../assets/flags images/flag_honduras.svg";
import NicaraguaFlag from "../../../assets/flags images/flag_nicaragua.svg";
export const whole_bean_coffee = [
  {
    id: 1,
    product_name: "Medium Roast",
    product_subtitle: "Whole Bean Venezuela",
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
      },
    ],
  },

  {
    id: 3,
    product_name: "Medium Roast",
    product_subtitle: "Whole Bean Honduras",
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
      },
    ],
  },

  {
    id: 4,
    product_name: "Medium Roast",
    product_subtitle: "Whole Bean Nicaragua",
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
      },
    ],
  },
];

// export const whole_bean_coffee = [
//   {
//     id: 1,
//     product_name: "Medium Roast",
//     product_subtitle: "Whole Bean Venezuela",
//     main_image: require("../../../assets/products_images/vzla_bag_wb.png"),
//     description:
//       "From the high mountains of the Andes, our Venezuelan coffee boasts a rich aroma with delicate notes of chocolate and caramel. A smooth, balanced cup that embodies the essence of our heritage.",
//     rating: 4.8,
//     flag_image: VzlaFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeGrams: 250,
//         price: 8.99,
//         isDefault: true,
//         image_1: require("../../../assets/products_images/vzla_bag_wb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.jpeg"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.jpeg"),
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeGrams: 500,
//         price: 15.99,
//         image_1: require("../../../assets/products_images/vzla_bag_wb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.jpeg"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.jpeg"),
//       },
//       {
//         id: "1000",
//         sizeLabel: "1 kg",
//         sizeGrams: 1000,
//         price: 29.99,
//         image_1: require("../../../assets/products_images/vzla_bag_wb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.jpeg"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.jpeg"),
//       },
//     ],
//   },

//   {
//     id: 2,
//     product_name: "Medium Roast",
//     product_subtitle: "Whole Bean Mexico",
//     main_image: require("../../../assets/products_images/mexico_bag_wb.png"),
//     description:
//       "Sourced from Mexico's finest coffee-growing regions, this dark roast offers a bold flavor profile with hints of dark chocolate and a smoky finish. Perfect for those who crave a robust cup.",
//     rating: 4.6,
//     flag_image: MexicoFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeGrams: 250,
//         price: 9.49,
//         isDefault: true,
//         image_1: require("../../../assets/products_images/mexico_bag_wb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.jpeg"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.jpeg"),
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeGrams: 500,
//         price: 16.99,
//         image_1: require("../../../assets/products_images/mexico_bag_wb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.jpeg"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.jpeg"),
//       },
//       {
//         id: "1000",
//         sizeLabel: "1 kg",
//         sizeGrams: 1000,
//         price: 31.99,
//         image_1: require("../../../assets/products_images/mexico_bag_wb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.jpeg"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.jpeg"),
//       },
//     ],
//   },

//   {
//     id: 3,
//     product_name: "Medium Roast",
//     product_subtitle: "Whole Bean Honduras",
//     main_image: require("../../../assets/products_images/honduras_bag_wb.png"),
//     description:
//       "Grown in the fertile lands of Honduras, our coffee offers a bright acidity with hints of citrus and nuts.",
//     rating: 4.9,
//     flag_image: HondurasFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeGrams: 250,
//         price: 9.49,
//         isDefault: true,
//         image_1: require("../../../assets/products_images/honduras_bag_wb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.jpeg"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.jpeg"),
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeGrams: 500,
//         price: 16.99,
//         image_1: require("../../../assets/products_images/honduras_bag_wb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.jpeg"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.jpeg"),
//       },
//       {
//         id: "1000",
//         sizeLabel: "1 kg",
//         sizeGrams: 1000,
//         price: 31.99,
//         image_1: require("../../../assets/products_images/honduras_bag_wb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.jpeg"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.jpeg"),
//       },
//     ],
//   },

//   {
//     id: 4,
//     product_name: "Medium Roast",
//     product_subtitle: "Whole Bean Nicaragua",
//     main_image: require("../../../assets/products_images/nicaragua_bag_wb.png"),
//     description:
//       "From the volcanic slopes of Nicaragua, our coffee presents a complex profile with notes of cocoa and red fruit.",
//     rating: 5.0,
//     flag_image: NicaraguaFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeGrams: 250,
//         price: 9.49,
//         isDefault: true,
//         image_1: require("../../../assets/products_images/nicaragua_bag_wb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.jpeg"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.jpeg"),
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeGrams: 500,
//         price: 16.99,
//         image_1: require("../../../assets/products_images/nicaragua_bag_wb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.jpeg"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.jpeg"),
//       },
//       {
//         id: "1000",
//         sizeLabel: "1 kg",
//         sizeGrams: 1000,
//         price: 31.99,
//         image_1: require("../../../assets/products_images/nicaragua_bag_wb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.jpeg"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.jpeg"),
//       },
//     ],
//   },
// ];
export const ground_bean_coffee = [
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
      },
      {
        id: "500",
        sizeLabel: "500 gr",
        sizeLabel_ounces: "18 oz",
        sizeGrams: 500,
        price: 15.99,
        images: [
          //   require("../../../assets/products_images/vzla_bag_gb.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
          require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
          require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
        ],
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
      },
    ],
  },

  {
    id: 2,
    product_name: "Medium Roast",
    product_subtitle: "Ground Bean Mexico",
    description:
      "Sourced from Mexico's finest coffee-growing regions, this dark roast offers a bold flavor profile with hints of dark chocolate and a smoky finish. Perfect for those who crave a robust cup.",
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
      },
    ],
  },

  {
    id: 3,
    product_name: "Medium Roast",
    product_subtitle: "Ground Bean Honduras",
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
      },
    ],
  },

  {
    id: 4,
    product_name: "Medium Roast",
    product_subtitle: "Ground Bean Nicaragua",
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
      },
    ],
  },
];

// export const ground_bean_coffee = [
//   {
//     id: 1,
//     product_name: "Medium Roast",
//     product_subtitle: "Ground Bean Venezuela",
//     main_image: require("../../../assets/products_images/vzla_bag_gb.png"),
//     description:
//       "From the high mountains of the Andes, our Venezuelan coffee boasts a rich aroma with delicate notes of chocolate and caramel. A smooth, balanced cup that embodies the essence of our heritage.",
//     rating: 4.8,
//     flag_image: VzlaFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeGrams: 250,
//         price: 8.99,
//         isDefault: true,
//         image_1: require("../../../assets/products_images/vzla_bag_gb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeGrams: 500,
//         price: 15.99,
//         image_1: require("../../../assets/products_images/vzla_bag_gb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//       },
//       {
//         id: "1000",
//         sizeLabel: "1 kg",
//         sizeGrams: 1000,
//         price: 29.99,
//         image_1: require("../../../assets/products_images/vzla_bag_gb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//       },
//     ],
//   },

//   {
//     id: 2,
//     product_name: "Medium Roast",
//     product_subtitle: "Ground Bean Mexico",
//     main_image: require("../../../assets/products_images/mexico_bag_gb.png"),
//     description:
//       "Sourced from Mexico's finest coffee-growing regions, this dark roast offers a bold flavor profile with hints of dark chocolate and a smoky finish. Perfect for those who crave a robust cup.",
//     rating: 4.6,
//     flag_image: MexicoFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeGrams: 250,
//         price: 9.49,
//         isDefault: true,
//         image_1: require("../../../assets/products_images/mexico_bag_gb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeGrams: 500,
//         price: 16.99,
//         image_1: require("../../../assets/products_images/mexico_bag_gb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//       },
//       {
//         id: "1000",
//         sizeLabel: "1 kg",
//         sizeGrams: 1000,
//         price: 31.99,
//         image_1: require("../../../assets/products_images/mexico_bag_gb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//       },
//     ],
//   },

//   {
//     id: 3,
//     product_name: "Medium Roast",
//     product_subtitle: "Ground Bean Honduras",
//     main_image: require("../../../assets/products_images/honduras_bag_gb.png"),
//     description:
//       "Grown in the fertile lands of Honduras, our coffee offers a bright acidity with hints of citrus and nuts.",
//     rating: 4.9,
//     flag_image: HondurasFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeGrams: 250,
//         price: 9.49,
//         isDefault: true,
//         image_1: require("../../../assets/products_images/honduras_bag_gb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeGrams: 500,
//         price: 16.99,
//         image_1: require("../../../assets/products_images/honduras_bag_gb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//       },
//       {
//         id: "1000",
//         sizeLabel: "1 kg",
//         sizeGrams: 1000,
//         price: 31.99,
//         image_1: require("../../../assets/products_images/honduras_bag_gb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//       },
//     ],
//   },

//   {
//     id: 4,
//     product_name: "Medium Roast",
//     product_subtitle: "Ground Bean Nicaragua",
//     main_image: require("../../../assets/products_images/nicaragua_bag_gb.png"),
//     description:
//       "From the volcanic slopes of Nicaragua, our coffee presents a complex profile with notes of cocoa and red fruit.",
//     rating: 5.0,
//     flag_image: NicaraguaFlag,

//     size_variants: [
//       {
//         id: "250",
//         sizeLabel: "250 gr",
//         sizeGrams: 250,
//         price: 9.49,
//         isDefault: true,
//         image_1: require("../../../assets/products_images/nicaragua_bag_gb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//       },
//       {
//         id: "500",
//         sizeLabel: "500 gr",
//         sizeGrams: 500,
//         price: 16.99,
//         image_1: require("../../../assets/products_images/nicaragua_bag_gb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//       },
//       {
//         id: "1000",
//         sizeLabel: "1 kg",
//         sizeGrams: 1000,
//         price: 31.99,
//         image_1: require("../../../assets/products_images/nicaragua_bag_gb.png"),
//         image_2: require("../../../assets/transitory_products_images/marbella_transitory_1.jpeg"),
//         image_3: require("../../../assets/transitory_products_images/marbella_transitory_2.png"),
//         image_4: require("../../../assets/transitory_products_images/marbella_transitory_3.png"),
//       },
//     ],
//   },
// ];
