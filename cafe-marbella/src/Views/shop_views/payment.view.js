import React, { useContext, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

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
import { safeGoBack } from "../../infrastructure/navigation/navigation.helpers";
import { Snack_Bar_Component } from "../../components/others/snack_bar.component";

import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";
import { OrdersContext } from "../../infrastructure/services/orders/orders.context";
import { CartContext } from "../../infrastructure/services/cart/cart.context";
import { GlobalContext } from "../../infrastructure/services/global/global.context";

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
  //console.log("MY ORDER IN PAYMENT VIEW:", JSON.stringify(myOrder, null, 2));
  const { user_id } = myOrder || {};
  const { resettingCart } = useContext(CartContext);

  const navigation = useNavigation();
  const { t } = useTranslation();

  const { snackbar, showErrorSnackbar, hideSnackbar } =
    useContext(GlobalContext);

  useEffect(() => {
    setMyOrder((prev) => ({
      ...prev,
      payment_information: {
        ...prev.payment_information,
        card_id: "",
        last_four: "",
        payment_status: "pending",
        transaction_id: "",
      },
    }));
  }, []);

  useEffect(() => {
    if (!cardVerified && cardError) {
      showErrorSnackbar(cardError);

      setCardError(null); // prevents reopening
    }
  }, [cardError, cardVerified]);

  console.log("CARD VERIFIED STATE:", cardVerified);
  console.log(
    "MY ORDER IN PAYMENT VIEW WITH SHIPMENT INFO:",
    JSON.stringify(myOrder, null, 2)
  );

  const hasNameOnCard = String(nameOnCard ?? "").trim().length > 0;
  const shouldShowNameError = cardVerified && !hasNameOnCard;
  const canPay = hasNameOnCard && cardVerified && !isLoading;

  return (
    <SafeArea background_color="#FFFFFF">
      {isLoading ? (
        <Global_activity_indicator
          caption={t("payment_view.activity_indicator")}
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
            label="Payment"
            action={() =>
              safeGoBack(navigation, "Shop_Order_Review_View", {
                order: myOrder,
              })
            }
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
              <Text variant="raleway_bold_18">{t("payment_view.title")}</Text>
            </Spacer>
          </Container>
          <DataInput
            // label="Credit card holder Full name"
            label={t("payment_view.data_input_name")}
            onChangeText={(value) => {
              hideSnackbar();
              setNameOnCard(value);
            }}
            value={nameOnCard}
            border_color={
              shouldShowNameError ? theme.colors.text.error : "#3A2F01"
            }
            border_width={shouldShowNameError ? "2px" : "1px"}
            activeUnderlineColor={
              shouldShowNameError ? theme.colors.text.error : "#3A2F01"
            }
            fontFamily="DMSans-Bold"
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
            caption={
              isLoading
                ? t("payment_view.cta.processing")
                : t("payment_view.cta.make")
            }
            caption_text_variant={
              !canPay ? "dm_sans_bold_20_grey" : "dm_sans_bold_20"
            }
            isDisabled={!canPay}
            action={async () => {
              if (!canPay) {
                if (!hasNameOnCard) {
                  showErrorSnackbar(t("payment_view.errors.name_required"));
                  return;
                }

                if (!cardVerified) {
                  showErrorSnackbar(t("payment_view.errors.card_required"));
                  return;
                }

                return;
              }

              try {
                console.log("Card state before onPay:", card);
                console.log("NAME ON CARD:", nameOnCard);
                const response = await onPay(nameOnCard, card, myOrder);

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
                  err?.message || t("payment_view.errors.generic");

                setCardVerified(false);
                setCardError(null);

                if (err?.payment_intent_status === "requires_action") {
                  console.log(
                    "Payment requires additional authentication:",
                    err
                  );
                } else if (
                  err?.payment_intent_status === "requires_payment_method"
                ) {
                  console.log(
                    "Payment requires a different payment method:",
                    err
                  );
                }

                showErrorSnackbar(message);

                console.log("Payment failed:", {
                  status: response?.status,
                  message,
                  code: err?.code,
                  decline_code: err?.decline_code,
                  payment_intent_status: err?.payment_intent_status,
                });

                return;
              } catch (unexpected) {
                console.log("Unexpected CTA error:", unexpected);

                setCardVerified(false);
                setCardError(null);

                showErrorSnackbar(t("payment_view.errors.generic"));
              }
            }}
          />
        </Container>
      )}
      <Snack_Bar_Component
        snackbar={snackbar}
        bottom_ios={280}
        bottom_android={280}
      />
    </SafeArea>
  );
}
