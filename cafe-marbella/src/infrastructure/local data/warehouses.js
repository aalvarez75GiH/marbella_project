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
      address: "123 Athens St, Athens, Greece",
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
      address: "123 Athens St, Athens, Greece",
    },

    // 🔥 replace products: [] with inventory
    inventory: {
      // sku = `${productId}:${variantId}`
      "vzla-medium-whole:250": 1,
      "vzla-medium-whole:500": 1,
      "vzla-medium-whole:1000": 1,

      "vzla-medium-ground:250": 3,
      "vzla-medium-ground:500": 11,
      "vzla-medium-ground:1000": 10,

      "mex-medium-ground:250": 6,
      "mex-medium-ground:500": 2,
      "mex-medium-ground:1000": 11,
    },
  },
];
