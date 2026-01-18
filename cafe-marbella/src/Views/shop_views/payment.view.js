import React, { useContext } from "react";
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
import { Global_activity_indicator } from "../../components/activity indicators/global_activity_indicator_screen.component";

import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { CartContext } from "../../infrastructure/services/cart/cart.context";

import { CheckIcon } from "../../../assets/modified_icons/success_icon";

export default function Payment_View() {
  const {
    nameOnCard,
    setNameOnCard,
    card,
    isLoading,
    onPay,
    cardIsLoading,
    cardVerified,
    onSuccess,
    whileIsSuccess,
    setCardVerified,
    cardError,
    setCardError,
  } = useContext(PaymentsContext);

  const { myOrder, setMyOrder } = useContext(OrdersContext);
  const { user_id } = myOrder || {};
  const { resettingCart, setCart } = useContext(CartContext);

  const navigation = useNavigation();
  console.log("CARD VERIFIED STATE:", cardVerified);
  console.log("MY ORDER IN PAYMENT VIEW:", JSON.stringify(myOrder, null, 2));

  return (
    <SafeArea background_color="#FFFFFF">
      {isLoading ? (
        <Global_activity_indicator
          caption="Wait, we are making the payment..."
          caption_width="65%"
          // color={"red"}
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
              console.log("Card verification error:", error_message);
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
            </Container>
          )}
          {!cardVerified && cardError && (
            <Container
              width="100%"
              align="center"
              direction="row"
              justify="flex-start"
              color={theme.colors.bg.elements_bg}
            >
              <Container
                width="100%"
                // color="green"
                color={theme.colors.bg.elements_bg}
                justify="flex-start"
                align="flex-start"
              >
                <Spacer position="left" size="large">
                  <Text
                    variant="dm_sans_bold_14_error"
                    color={theme.colors.text.success_text}
                  >
                    {cardError}
                  </Text>
                </Spacer>
              </Container>
            </Container>
          )}
          <Container
            width="100%"
            height="10%"
            justify="center"
            align="center"
            color={theme.colors.bg.elements_bg}
          />

          {cardVerified && (
            <Regular_CTA
              width="95%"
              height="8%"
              color={theme.colors.ui.business}
              border_radius={"40px"}
              caption={isLoading ? "Processing..." : "Make the payment"}
              caption_text_variant="dm_sans_bold_20"
              disabled={isLoading} // ✅ prevent double taps if your CTA supports it
              action={async () => {
                // ✅ hard guard even if CTA doesn’t support disabled
                if (isLoading) return;

                try {
                  console.log("Card state before onPay:", card);

                  const response = await onPay(nameOnCard, card, myOrder);
                  console.log("onPay response:", response);

                  // ✅ Success
                  if (response?.status === 200) {
                    // If your backend might succeed but not create an order, guard it:
                    if (!response?.order) {
                      console.log(
                        "Payment succeeded but order is null:",
                        response
                      );
                      // Optional: show UI message
                      // showToast("Payment succeeded, but we couldn't create the order. Please contact support.")
                      return;
                    }

                    // Reset cart (best-effort)
                    try {
                      await resettingCart(user_id);
                    } catch (err) {
                      console.log("Error resetting cart:", err);
                      // Optional: still proceed to confirmation even if cart reset fails
                    }

                    setMyOrder(response.order);
                    navigation.navigate("Order_Confirmation_View");
                    return;
                  }

                  // ✅ Failure handling
                  const err = response?.error;
                  const message =
                    err?.message || "Payment failed. Please try again.";

                  // Optional: if you want to hide "Card verified" after a decline:
                  setCardVerified(false);

                  // Handle specific payment-intent statuses (future-proof)
                  if (err?.payment_intent_status === "requires_action") {
                    // If you implement 3DS later, you can route to an auth screen here.
                    // navigation.navigate("PaymentAuth", { clientSecret: err.client_secret })
                    console.log(
                      "Payment requires additional authentication:",
                      err
                    );
                  } else if (
                    err?.payment_intent_status === "requires_payment_method"
                  ) {
                    // Card declined — user should try another card
                    console.log(
                      "Payment requires a different payment method:",
                      err
                    );
                  }

                  setCardError(message);
                  // ✅ Show the user something actionable (choose ONE approach)
                  // 1) Navigate to an error screen:
                  // navigation.navigate("PaymentError", { error: message, code: err?.code, decline_code: err?.decline_code });

                  // 2) Or show a toast/snackbar:
                  // showToast(message);

                  // For now, at least log it:
                  console.log("Payment failed:", {
                    status: response?.status,
                    message,
                    code: err?.code,
                    decline_code: err?.decline_code,
                    payment_intent_status: err?.payment_intent_status,
                  });
                } catch (unexpected) {
                  console.log("Unexpected CTA error:", unexpected);
                  // showToast("Something went wrong. Please try again.");
                }
              }}
            />
          )}
        </Container>
      )}
    </SafeArea>
  );
}
