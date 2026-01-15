/* eslint-disable */

const express = require("express");
const paymentsRouter = express.Router();
const stripeClient = require("stripe")(process.env.STRIPE_KEY);
const ordersControllers = require("../orders/orders.controllers");
// const { v4: uuidv4 } = require("uuid");
// const paymentsControllers = require("./payments.controllers");

paymentsRouter.post("/payments", async (req, res) => {
  const totalForStripe = req.body.totalForStripe;
  const card_token = req.body.card_id;
  const order = req.body.order;
  let createdOrder = null;
  console.log("CUSTOMER ORDER AT PAYMENTS ROUTE:", order);
  const data = {
    token: req.body.card_id,
    amount: req.body.totalForStripe,
    name: req.body.nameOnCard,
  };

  // Validate request body
  if (!data.token || !data.amount || !data.name) {
    return res.status(400).json({
      status: "Failed",
      msg: "Invalid request data. Please provide card_id, totalForStripe, and nameOnCard.",
    });
  }

  try {
    const paymentIntentResponse = await stripeClient.paymentIntents.create({
      amount: Number(totalForStripe), // cents
      currency: "usd",
      payment_method_types: ["card"],
      payment_method_data: {
        type: "card",
        card: { token: card_token }, // see note below
      },
      confirm: true,
    });

    if (paymentIntentResponse.status !== "succeeded") {
      return res.status(402).json({
        status: "failed",
        message:
          "Payment requires additional action or a different payment method.",
        code: "payment_intent_not_succeeded",
        payment_intent: paymentIntentResponse.id,
        payment_intent_status: paymentIntentResponse.status,
        next_action: paymentIntentResponse.next_action || null,
      });
    }

    let stripe_payment_id = paymentIntentResponse.id;
    if (paymentIntentResponse.status === "succeeded" && order) {
      console.log(
        "paymentIntentResponse STATUS:",
        paymentIntentResponse.status
      );
      console.log("Payment succeeded, creating order...");

      const orderWithPaidStatus = {
        ...order,
        payment_information: {
          ...order.payment_information, // ✅ correct source
          payment_status: "paid",
          paid_at: new Date().toISOString(),
        },
      };

      createdOrder = await ordersControllers.createOrder(
        orderWithPaidStatus,
        order.user_id,
        stripe_payment_id
      );
      console.log("ORDER CREATED AT PAYMENTS ROUTE:", createdOrder);
    }

    const dataToReturn = {
      paymentIntentResponse,
      order: createdOrder ?? null,
    };
    //   console.log(paymentIntentResponse);
    // res.json(paymentIntentResponse);
    res.json(dataToReturn);
    return;
  } catch (error) {
    console.log("ERROR CATCHED:", error);
    if (error.code === "incorrect_cvc") {
      res
        .status(402)
        .send(
          "We're sorry, it looks like your cvc number is not correct, try again.. "
        );
    }
    if (error.code === "incorrect_number") {
      res.status(402).send("Sorry, Your card number is invalid, try again... ");
    }
    switch (error.decline_code) {
      case "insufficient_funds":
        console.log("credit card declined - insufficient funds...");
        res
          .status(402)
          .send(
            "We're sorry, your card was declined. Don't worry, come back later... "
          );
        // res.send("Your credit card was declined for insufficient funds...");
        break;
      case "lost_card":
        console.log("Credit card is lost");
        res
          .status(402)
          .send(
            "Sorry, this card has been lost, are you sure its the right card?"
          );
        // res.send("Your credit card is lost...");
        break;
      case "generic_decline":
        console.log("Generic decline ");
        res
          .status(402)
          .send(
            "Sorry, Your card was declined for unknown reasons. Don't worry, come back later...we'll be here waiting. "
          );
        break;
      default:
        console.log("Your credit card was declined...");
        res
          .status(402)
          .send(
            "Sorry, Your card was declined. Come back soon, we'll be waiting..."
          );
    }
  }
});

module.exports = paymentsRouter;
