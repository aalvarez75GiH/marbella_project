import React, { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";

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
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { AuthenticationContext } from "../../infrastructure/services/authentication/authentication.context";

import SuccessIcon from "../../../assets/my_icons/success_check.svg";
import { CheckIcon } from "../../../assets/modified_icons/success_icon";

export default function Payment_View() {
  const { nameOnCard, setNameOnCard, card, setCard, setIsLoading, isLoading } =
    useContext(PaymentsContext);
  const [cardIsLoading, setCardIsLoading] = useState(false);
  const [pi_errorMessage, setPi_errorMessage] = useState(null);
  //   const [paymentDone, setPaymentDone] = useState(false);
  const [cardVerified, setCardVerified] = useState(false);

  const { myOrder } = useContext(OrdersContext);
  const { pricing } = myOrder;
  const { total: totalForStripe } = pricing || {};

  const { user } = useContext(AuthenticationContext);

  const navigation = useNavigation();

  console.log("MY ORDER AT PAYMENT VIEW:", JSON.stringify(myOrder, null, 2));

  const onPay = async (nameOnCard, user, card, order) => {
    setIsLoading(true);
    console.log("onPay triggered with:", nameOnCard, user, card);

    if (!card || !card.id) {
      console.error("Card is null or missing ID");
      setIsLoading(false);
      setPi_errorMessage(true);
      return;
    }

    try {
      const data = await paymentRequest(
        card.id,
        totalForStripe,
        nameOnCard,
        order
      );
      console.log("Payment successful:", JSON.stringify(data.order, null, 2));
      return data.status;
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      navigation.navigate("PaymentError", {
        error: error.response?.data || "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSuccess = (card) => {
    console.log("Card received in onSuccess:", card);
    setPi_errorMessage(false);
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

  return (
    <SafeArea background_color="#FFFFFF">
      {isLoading ? (
        <Global_activity_indicator
          caption="Wait, we are making the payment..."
          caption_width="65%"
        />
      ) : (
        <Container
          width="100%"
          height="100%"
          color={theme.colors.bg.elements_bg}
          justify="flex-start"
          align="center"
        >
          <Go_Back_Header
            label="Card holder name"
            action={() => navigation.goBack()}
          />
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
            cardIsLoading={cardIsLoading}
          />

          <Container
            width="100%"
            height="5%"
            justify="center"
            color={theme.colors.bg.elements_bg}
          />
          {cardVerified && (
            <Container
              width="100%"
              justify="center"
              align="center"
              color={theme.colors.bg.elements_bg}
              direction="row"
            >
              {/* <Spacer position="top" size="small" /> */}
              <Spacer position="left" size="large">
                <Text
                  variant="dm_sans_bold_14"
                  color={theme.colors.text.success_text}
                >
                  Card verified successfully!
                </Text>
              </Spacer>
              <Spacer position="left" size="large" />
              <CheckIcon size={25} color={"green"} />
              {/* <SuccessIcon width={20} height={20} fill={"green"} /> */}
            </Container>
          )}
          <Container
            width="100%"
            height="10%"
            justify="center"
            align="center"
            color={theme.colors.bg.elements_bg}
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
              const response = await onPay(nameOnCard, user, card, myOrder);
              console.log("onPay response:", response); // Debugging log
              if (response === 200) {
                navigation.navigate("Order_Confirmation_View");
                //   setPaymentDone(true);
              }
            }}
          />
        </Container>
      )}
    </SafeArea>
  );
}
