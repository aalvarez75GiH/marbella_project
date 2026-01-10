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
export const paymentRequest = async (card_id, totalForStripe, nameOnCard) => {
  console.log("CARD ID AT SERVICE:", card_id);
  console.log("TOTAL AT SERVICE:", totalForStripe);
  console.log("NAME ON CARD AT SERVICE:", nameOnCard);
  return await axios
    .post(`${paymentsEndPoint}/payments`, {
      card_id: card_id,
      totalForStripe: totalForStripe,
      nameOnCard: nameOnCard,
    })
    .then((response) => {
      console.log("REPONSE AT SERVICE:", JSON.stringify(response, null, 2));
      //   return response.data;
      return {
        status: response.status,
        paymentData: response.data,
      };
    })
    .catch((error) => {
      return error;
    });
};
