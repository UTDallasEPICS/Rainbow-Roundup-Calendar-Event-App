import { defineEventHandler, readBody } from "h3";
import Stripe from "stripe"; // Stripe import for TypeScript

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!);

interface PaymentBody {
  amount: number; // Amount in cents
}

export default defineEventHandler(async (event) => {
  const body: PaymentBody = await readBody(event);

  try {
    // Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.amount,
      currency: "usd",
    });

    return {
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `Error creating payment intent: ${errorMessage}`,
    };
  }
});
