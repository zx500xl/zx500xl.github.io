require('dotenv').config({ path: __dirname + '/.env' });
const express = require("express");
const bodyParser = require("body-parser");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(bodyParser.json());

app.post("/subscribe", async (req, res) => {
  const { token, user_email, price_id } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: user_email,
      source: token
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price_id }]
    });

    res.send({ success: true, subscription });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/payment-sheet", async (req, res) => {
  console.log("v3");
  const { user_email } = req.body;

  try {
    const customer = await stripe.customers.create({ email: user_email });

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2025-05-28.basil' }
    );

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['card']
    });

    res.send({
      setupIntent: setupIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post("/subscribe-applepay", async (req, res) => {
  const { payment_method, user_email, price_id } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: user_email,
      payment_method: payment_method,
      invoice_settings: {
        default_payment_method: payment_method
      }
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price_id }],
      expand: ['latest_invoice.payment_intent']
    });

    res.send({ success: true, subscription });
  } catch (err) {
    console.error('Apple Pay subscribe error:', err);
    res.status(500).send({ error: err.message });
  }
});

app.listen(4242);
