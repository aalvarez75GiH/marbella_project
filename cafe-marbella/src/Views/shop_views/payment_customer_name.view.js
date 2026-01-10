import React, { useState, useContext } from "react";

import { Go_Back_Header } from "../../components/headers/goBack_with_label.header";
import { SafeArea } from "../../components/spacers and globals/safe-area.component";
import { DataInput } from "../../components/inputs/data_text_input";
import { theme } from "../../infrastructure/theme";
import { Container } from "../../components/containers/general.containers";
import { Spacer } from "../../components/spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";
import { CreditCardInputComponent } from "../../components/payments/credit-card-input.component";
import { Regular_CTA } from "../../components/ctas/regular.cta";
import { paymentRequest } from "../../infrastructure/services/payments/payments.services";

import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { GlobalContext } from "../../infrastructure/services/global/global.context";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";

export default function Payment_Customer_Name_View() {
  const { nameOnCard, setNameOnCard, card, setCard } =
    useContext(PaymentsContext);
  const [isLoading, setIsLoading] = useState(false);
  const [pi_errorMessage, setPi_errorMessage] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);

  const { myOrder } = useContext(OrdersContext);
  const { pricing } = myOrder;
  const { total: totalForStripe } = pricing || {};

  const { user } = useContext(AuthenticationContext);

  const onPay = async (nameOnCard, user, card) => {
    setIsLoading(true);
    console.log("onPay triggered with:", nameOnCard, user, card);

    if (!card || !card.id) {
      console.error("Card is null or missing ID");
      setIsLoading(false);
      setPi_errorMessage(true);
      return;
    }

    try {
      const data = await paymentRequest(card.id, totalForStripe, nameOnCard);
      console.log("Payment successful:", JSON.stringify(data, null, 2));
      return data.status;
    } catch (error) {
      setIsLoading(false);
      console.error("Payment error:", error.response?.data || error.message);
      navigation.navigate("PaymentError", {
        error: error.response?.data || "Unknown error",
      });
    }
  };

  const onSuccess = (card) => {
    console.log("Card received in onSuccess:", card);
    setPi_errorMessage(false);
    setCard(card); // Update card state
  };

  const whileIsSuccess = (value) => {
    setIsLoading(value);
  };

  return (
    <SafeArea background_color="#FFFFFF">
      <Container
        width="100%"
        height="100%"
        color={theme.colors.bg.elements_bg}
        justify="flex-start"
        align="center"
      >
        <Go_Back_Header label="Card holder name" />
        <Spacer position="top" size="large" />
        <Container
          width="100%"
          height="10%"
          color={theme.colors.bg.elements_bg}
          justify="center"
          align="flex-start"
        >
          <Spacer position="left" size="large">
            <Text variant="raleway_bold_18">Your payment information</Text>
          </Spacer>
        </Container>
        <DataInput
          label="Credit card holder Full name"
          onChangeText={(value) => setNameOnCard(value)}
          value={nameOnCard}
          underlineColor={theme.colors.inputs.bottom_lines}
          activeUnderlineColor={"#3A2F01"}
        />
        <Spacer position="top" size="medium" />
        <CreditCardInputComponent
          autoFocus={true}
          name={nameOnCard}
          onSuccess={(response) => onSuccess(response)}
          whileIsSuccess={(value) => whileIsSuccess(value)}
          onError={(error_message) => {
            navigation.navigate("PaymentError", {
              error: error_message,
            });
          }}
        />

        <Regular_CTA
          width="95%"
          height="8%"
          color={theme.colors.ui.business}
          border_radius={"40px"}
          caption="Make the payment"
          caption_text_variant="dm_sans_bold_20"
          action={async () => {
            console.log("Card state before onPay:", card); // Debugging log
            const response = await onPay(nameOnCard, user, card);
            console.log("onPay response:", response); // Debugging log
            if (response === "Success") {
              setPaymentDone(true);
            }
          }}
          //   action={() => {
          //     console.log("Card state before onPay:", card); // Debugging log
          //     onPay(nameOnCard, user, card);
          //   }}
        />
        {paymentDone && (
          <Text variant="raleway_bold_14">Payment completed successfully!</Text>
        )}
      </Container>
    </SafeArea>
  );
}
