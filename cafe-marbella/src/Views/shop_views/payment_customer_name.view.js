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

import { PaymentsContext } from "../../infrastructure/services/payments/payments.context";

export default function Payment_Customer_Name_View() {
  const { nameOnCard, setNameOnCard, card } = useContext(PaymentsContext);
  const [isLoading, setIsLoading] = useState(false);
  //   const [card, setCard] = useState(null);
  const [pi_errorMessage, setPi_ErrorMessage] = useState(null);

  const onSuccess = (card) => {
    console.log("CARD AT CUSTOMER NAME VIEW: ", JSON.stringify(card, null, 2));
    setPi_ErrorMessage(false);
    setCard(card);
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
        // color={"lightyellow"}
        justify="flex-start"
        align="center"
      >
        <Go_Back_Header label="Card holder name" />
        <Spacer position="top" size="large" />
        <Container
          width="100%"
          height="10%"
          color={theme.colors.bg.elements_bg}
          //   color="green"
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
        {card && (
          //   <Spacer position="top" size="extraLarge">
          <Regular_CTA
            width="95%"
            height="8%"
            color={theme.colors.ui.business}
            border_radius={"40px"}
            caption="Make the payment"
            caption_text_variant="dm_sans_bold_20"
            action={() => null}
          />
          //   </Spacer>
        )}
      </Container>
    </SafeArea>
  );
}
