/* eslint-disable */

const express = require("express");
const paymentsRouter = express.Router();
const stripeClient = require("stripe")(process.env.STRIPE_KEY);
// const { v4: uuidv4 } = require("uuid");
// const paymentsControllers = require("./payments.controllers");

paymentsRouter.post("/payments", async (req, res) => {
  const totalForStripe = req.body.totalForStripe;
  const card_token = req.body.card_id;
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

    //   console.log(paymentIntentResponse);
    res.json(paymentIntentResponse);
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
      default:
        console.log("Your credit card was declined...");
        res
          .status(402)
          .send(
            "Sorry, Your card was declined. Come back soon, we'll be waiting..."
          );
    }
  }

  // Send response
  res.status(201).json({
    status: "Success",
    data,
  });
});

module.exports = paymentsRouter;
