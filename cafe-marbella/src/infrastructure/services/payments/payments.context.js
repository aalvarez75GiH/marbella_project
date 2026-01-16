import React, { useEffect, useState, createContext, useContext } from "react";

import { paymentRequest } from "./payments.services";
export const PaymentsContext = createContext();

export const Payments_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardError, setCardError] = useState(null);
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

  const normalizePaymentError = (err) => {
    const status = err?.response?.status ?? null;
    const data = err?.response?.data ?? null;

    const message =
      data?.message ||
      data?.msg ||
      err?.message ||
      "Payment failed. Please try again.";

    return {
      status,
      message,
      code: data?.code || data?.error?.code || err?.code || null,
      decline_code:
        data?.decline_code ||
        data?.error?.decline_code ||
        err?.decline_code ||
        null,
      type: data?.type || data?.error?.type || err?.type || null,
      payment_intent: data?.payment_intent || null,
      payment_intent_status: data?.payment_intent_status || null,
      next_action: data?.next_action || null,
      raw: data || err,
    };
  };
  const onPay = async (nameOnCard, card, myOrder) => {
    setIsLoading(true);
    setError(null);

    try {
      const totalForStripe = myOrder?.pricing?.total;

      if (!nameOnCard?.trim()) {
        const e = {
          status: 400,
          message: "Please enter the card holder name.",
          code: "missing_name",
        };
        setError(e);
        return { status: e.status, order: null, error: e };
      }

      if (!totalForStripe || Number(totalForStripe) <= 0) {
        const e = {
          status: 400,
          message: "Order total is missing. Please try again.",
          code: "missing_total",
        };
        setError(e);
        return { status: e.status, order: null, error: e };
      }

      if (!card?.id) {
        const e = {
          status: 400,
          message: "Card not verified yet. Please verify your card first.",
          code: "missing_card",
        };
        setError(e);
        return { status: e.status, order: null, error: e };
      }

      const result = await paymentRequest(
        card.id,
        totalForStripe,
        nameOnCard,
        myOrder
      );

      return {
        status: result.httpStatus ?? 200,
        order: result.order,
        paymentData: result.paymentData,
        error: null,
      };
    } catch (err) {
      const e = normalizePaymentError(err);
      setError(e);

      console.log("PAYMENT ERROR:", {
        status: e.status,
        code: e.code,
        decline_code: e.decline_code,
        message: e.message,
        raw: e.raw,
      });

      return { status: e.status || 500, order: null, error: e };
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
        cardError,
        setCardError,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  );
};
