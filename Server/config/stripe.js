const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createStripeSession = async (amount, currency, userEmail) => {
  try {
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
            unit_amount: amount * 100, // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/dashboard/enrolled-courses`,
      cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
    });
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
};