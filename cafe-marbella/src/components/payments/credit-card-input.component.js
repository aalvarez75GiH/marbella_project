import React, { useContext, useState } from "react";
import { LiteCreditCardInput } from "react-native-credit-card-input";
import { ActivityIndicator } from "react-native-paper";
import { View, Text } from "react-native";
import { Spacer } from "../spacers and globals/optimized.spacer.component";
import { Container } from "../containers/general.containers";

import { theme } from "../../infrastructure/theme";
import { cardTokenRequest } from "../../infrastructure/services/payments/payments.services";

import { OrdersContext } from "../../infrastructure/services/orders/orders.context";

import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";

export const CreditCardInputComponent = ({
  name = "Jonh Doe",
  onSuccess,
  onError,
  cardIsLoading,
  whileIsSuccess,
  // setCard,
  // card,
}) => {
  const { myOrder, setMyOrder } = useContext(OrdersContext);
  const [isLoading, setIsLoading] = useState(false);
  const { card, setCard } = useContext(PaymentsContext);

  const onChange = async (formData) => {
    console.log("FORM DATA:", formData);
    const { values, status } = formData;
    const isIncomplete = Object.values(status).includes("incomplete");
    console.log("IS INCOMPLETE?", isIncomplete);
    const expiry = values.expiry.split("/");
    console.log("EXPIRY:", expiry);

    const card = {
      number: values.number,
      exp_month: expiry[0],
      exp_year: expiry[1],
      cvc: values.cvc,
      name: name,
    };

    console.log("CARD INFO:", card);
    console.log(
      "MY ORDER AT INPUT COMPONENT:",
      JSON.stringify(myOrder, null, 2)
    );
    // setCard(card);
    if (!isIncomplete) {
      setIsLoading(true);
      try {
        const card_from_stripe = await cardTokenRequest(card);
        console.log("CARD_TOKEN_FROM_STRIPE:", card_from_stripe);
        setIsLoading(false);
        onSuccess(card_from_stripe);
        setMyOrder((prevOrder) => ({
          ...prevOrder,
          payment_information: {
            method: "credit_card",
            card_id: card_from_stripe.id,
            payment_status: "pending", // paid,unpaid, pending, failed, refunded, requires_payment
            transaction_id: "",
            billing_address: "",
            last_four: card_from_stripe.card.last4,
            shipping_address: {
              geo: {},
              physical_address: "",
            },
            stripe_order_id: "",
          },
        }));
      } catch (error) {
        console.log(
          "STRIPE TOKEN ERROR (full):",
          JSON.stringify(error, null, 2)
        );

        const stripeMessage =
          error?.raw?.message ||
          error?.message ||
          "Your card could not be verified. Please try again.";

        const stripeCode =
          error?.raw?.code || error?.code || error?.decline_code || null;

        const stripeParam = error?.raw?.param || error?.param || null;

        onError({
          message: stripeMessage,
          code: stripeCode,
          param: stripeParam,
          raw: error,
        });

        setIsLoading(false);
      }

      // catch (error) {
      //   onError("Take a look to your credit card information...");
      //   setIsLoading(false);
      // }
    }
  };

  return (
    <Spacer position="left" size="medium">
      <Container width="100%" height="auto" color={theme.colors.bg.elements_bg}>
        <LiteCreditCardInput onChange={onChange} />
      </Container>
    </Spacer>
  );
};
