import createStripe from "stripe-client";
import axios from "axios";
import { host } from "../../../util/env";

const stripe = createStripe(
  "pk_test_51LKvfVFxdTyvTLMGzdHGCTzTGSj6jPOu7X67alTtx7mnYHaAGNlgMdqEQSBTe071nMtliw5n9thuxJD3U5MtUOv000ouTnmZv9"
);
// ****** Request in order to get token from stripe
export const cardTokenRequest = (card) => {
  console.log(card);
  return stripe.createToken({ card });
};
