require("dotenv").config();
const Stripe = require('stripe');

exports.createStripeSession = async (amount, currency, userEmail) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured in environment variables");
  }
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'StudyNotion Course',
            },
            unit_amount: Math.round(amount * 100), // Stripe expects amounts in cents/paise
          },
          quantity: 1,
        },
      ],
      success_url: `${clientUrl}/dashboard/enrolled-courses`,
      cancel_url: `${clientUrl}/payment-failed`,
    });
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
};