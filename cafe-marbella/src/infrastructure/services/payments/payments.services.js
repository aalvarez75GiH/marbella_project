import createStripe from "stripe-client";
import axios from "axios";
import { environment } from "../../../util/env";
const { paymentsEndPoint } = environment;

const stripe = createStripe(
  "pk_test_51LKvfVFxdTyvTLMGzdHGCTzTGSj6jPOu7X67alTtx7mnYHaAGNlgMdqEQSBTe071nMtliw5n9thuxJD3U5MtUOv000ouTnmZv9"
);
// ****** Request in order to get token from stripe
export const cardTokenRequest = (card) => {
  console.log(card);
  return stripe.createToken({ card });
};

// ****** Request to firebase Payment end point in order to send info to Stripe

export const calculatingOrderTaxesRequest = async (order) => {
  const response = await axios.post(`${paymentsEndPoint}/tax`, order, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};
export const paymentRequest = async (
  card_id,
  totalForStripe,
  nameOnCard,
  order
) => {
  console.log("CARD ID AT SERVICE:", card_id);
  console.log("TOTAL AT SERVICE:", totalForStripe);
  console.log("NAME ON CARD AT SERVICE:", nameOnCard);
  console.log("ORDER AT SERVICE:", JSON.stringify(order, null, 2));

  const response = await axios.post(
    `${paymentsEndPoint}/payments`,
    {
      card_id,
      totalForStripe,
      nameOnCard,
      order,
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 20000, // optional
    }
  );

  // Return a consistent success shape
  return {
    httpStatus: response.status,
    paymentData: response.data,
    order: response.data?.order ?? null,
  };
};
