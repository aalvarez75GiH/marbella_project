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
  } = useContext(PaymentsContext);

  const { myOrder, setMyOrder } = useContext(OrdersContext);
  const { user_id } = myOrder || {};
  const { resettingCart, setCart } = useContext(CartContext);

  const navigation = useNavigation();

  // console.log("MY ORDER IN PAYMENT VIEW:", JSON.stringify(myOrder, null, 2));

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
              console.log("Card verification error:", error_message);
              // navigation.navigate("PaymentError", {
              //   error: error_message,
              // });
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
          {cardVerified && (
            <Regular_CTA
              width="95%"
              height="8%"
              color={theme.colors.ui.business}
              border_radius={"40px"}
              caption="Make the payment"
              caption_text_variant="dm_sans_bold_20"
              action={async () => {
                console.log("Card state before onPay:", card); // Debugging log
                const response = await onPay(nameOnCard, card, myOrder);
                console.log("onPay response:", response); // Debugging log
                if (response.status === 200) {
                  try {
                    await resettingCart(user_id);
                  } catch (error) {
                    console.log("Error resetting cart:", error);
                  } finally {
                    setMyOrder(response.order);
                    navigation.navigate("Order_Confirmation_View");
                  }
                }
              }}
            />
          )}
        </Container>
      )}
    </SafeArea>
  );
}
