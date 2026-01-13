import React, { useEffect, useState, createContext, useContext } from "react";

import { paymentRequest } from "./payments.services";
export const PaymentsContext = createContext();

export const Payments_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nameOnCard, setNameOnCard] = useState("");
  const [card, setCard] = useState(null);
  const [cardIsLoading, setCardIsLoading] = useState(false);
  const [cardVerified, setCardVerified] = useState(false);
  console.log("CARD AT CONTEXT: ", JSON.stringify(card, null, 2));

  //   const onSuccess = (card) => {
  //     console.log("CARD AT PAYMENTS CONTEXT: ", JSON.stringify(card, null, 2));
  //     // setPi_ErrorMessage(false);
  //     // setCard(card);
  //   };

  const onSuccess = (card) => {
    console.log("Card received in onSuccess:", card);
    if (card && card.id) {
      setCardVerified(true);
    } else {
      setCardVerified(false);
    }
    setCard(card); // Update card state
  };

  const whileIsSuccess = (value) => {
    setCardIsLoading(value);
  };

  //   console.log("NAME ON CARD AT PAYMENTS CONTEXT: ", nameOnCard);

  const onPay = async (nameOnCard, card, myOrder) => {
    setIsLoading(true);
    const { pricing } = myOrder;
    const { total: totalForStripe } = pricing || {};

    if (!card || !card.id) {
      //   console.error("Card is null or missing ID");
      setIsLoading(false);
      return;
    }

    try {
      const data = await paymentRequest(
        card.id,
        totalForStripe,
        nameOnCard,
        myOrder
      );
      console.log("Payment successful:", JSON.stringify(data.order, null, 2));

      const response = {
        status: data.status,
        order: data.order,
      };
      return response;
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      setError(error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaymentsContext.Provider
      value={{
        isLoading,
        setIsLoading,
        error,
        setError,
        setNameOnCard,
        nameOnCard,
        // onSuccess,
        whileIsSuccess,
        setCard,
        card,
        onPay,
        cardIsLoading,
        cardVerified,
        setCardVerified,
        onSuccess,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  );
};
