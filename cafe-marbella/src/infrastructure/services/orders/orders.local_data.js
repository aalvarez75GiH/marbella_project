export const myOrder_schema = {
  customer: {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    uid: "",
  },
  order_id: "",
  user_id: "",
  cart_id: "",
  pricing: { sub_total: 0, taxes: 0, discount: 0, shipping: 0, total: 0 },
  order_products: [],
  currency: "USD",
  order_status: "",
  created_at: "",
  updated_at: "",
  payment_information: {
    method: "",
    payment_status: "", // paid,unpaid, pending, failed, refunded, requires_payment
    transaction_id: "",
    billing_address: "",
    last_four: "",
    shipping_address: {
      geo: {},
      physical_address: "",
    },
    stripe_order_id: "",
  },
  warehouse_to_pickup: {
    warehouse_id: "",
    name: "",
    address: "",
    geo: {},
    phone_number: "",
  },
  delivery_type: "",
};
