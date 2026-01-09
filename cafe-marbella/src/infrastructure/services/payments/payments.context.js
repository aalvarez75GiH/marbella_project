import React, { useEffect, useState, createContext, useContext } from "react";

export const PaymentsContext = createContext();

export const Payments_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nameOnCard, setNameOnCard] = useState("");
  const [card, setCard] = useState(null);
  const [pi_errorMessage, setPi_ErrorMessage] = useState(null);

  console.log("CARD AT CONTEXT: ", JSON.stringify(card, null, 2));
  //   const whileIsSuccess = (value) => {
  //     console.log("VALUE AT PAYMENTS CONTEXT: ", JSON.stringify(value, null, 2));
  //     setIsLoading(value);
  //   };

  //   const onSuccess = (card) => {
  //     console.log("CARD AT PAYMENTS CONTEXT: ", JSON.stringify(card, null, 2));
  //     // setPi_ErrorMessage(false);
  //     // setCard(card);
  //   };

  console.log("NAME ON CARD AT PAYMENTS CONTEXT: ", nameOnCard);

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
        // whileIsSuccess,
        setCard,
        card,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  );
};
