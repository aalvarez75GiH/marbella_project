// export const warehouses = [
//   {
//     warehouse_name: "Athens warehouse",
//     warehouse_id: "WH001",
//     location: {
//       city: "Athens",
//       address: "123 Athens St, Athens, Greece",
//       latitude: 37.9838,
//       longitude: 23.7275,
//     },
//     active: true,
//     max_delivery_time: 45, // in minutes
//     max_limit_delivery_ratio: 32186.8,
//     max_limit_pickup_ratio: 32186.8,
//     warehouse_information: {
//       representative_name: "Aurelio Perez",
//       email: "athens_marbella@gmail.com",
//       phone: "+30 210 1234567",
//       opening_time: "08:00 AM",
//       closing_time: "05:00 PM",
//       address: " 123 Athens St, Athens, Greece",
//     },
//     products: [],
//   },
// ];
export const warehouses = [
  {
    warehouse_name: "Athens warehouse",
    warehouse_id: "WH001",
    location: {
      city: "Athens",
      address: "2159 West Broad st Suite B Athens GA 30606",
      latitude: 37.9838,
      longitude: 23.7275,
    },
    active: true,
    max_delivery_time: 45,
    max_limit_delivery_ratio: 32186.8,
    max_limit_pickup_ratio: 32186.8,
    warehouse_information: {
      representative_name: "Aurelio Perez",
      email: "athens_marbella@gmail.com",
      phone: "+30 210 1234567",
      opening_time: "08:00 AM",
      closing_time: "05:00 PM",
    },

    // 🔥 replace products: [] with inventory
    inventory: {
      // sku = `${productId}:${variantId}`
      /* =========================
         VENEZUELA
      ========================= */
      "vzla-medium-whole:250": 5,
      "vzla-medium-whole:500": 1,
      "vzla-medium-whole:1000": 1,

      "vzla-medium-ground:250": 10,
      "vzla-medium-ground:500": 0,
      "vzla-medium-ground:1000": 0,

      /* =========================
         MEXICO
      ========================= */
      // added whole (you already have it in catalog)
      "mex-medium-whole:250": 4,
      "mex-medium-whole:500": 3,
      "mex-medium-whole:1000": 2,

      "mex-medium-ground:250": 6,
      "mex-medium-ground:500": 2,
      "mex-medium-ground:1000": 11,

      /* =========================
         HONDURAS
      ========================= */
      "hnd-medium-whole:250": 5,
      "hnd-medium-whole:500": 3,
      "hnd-medium-whole:1000": 2,

      "hnd-medium-ground:250": 8,
      "hnd-medium-ground:500": 2,
      "hnd-medium-ground:1000": 2,

      /* =========================
         NICARAGUA
      ========================= */
      "nic-medium-whole:250": 2,
      "nic-medium-whole:500": 2,
      "nic-medium-whole:1000": 1,

      "nic-medium-ground:250": 1,
      "nic-medium-ground:500": 10,
      "nic-medium-ground:1000": 11,
    },
  },
];
