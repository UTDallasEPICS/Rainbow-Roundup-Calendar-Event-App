import { defineEventHandler, getMethod } from "h3";
import paymentIntent from "./payment.intent";

export default defineEventHandler(async (event) => {
  const method = event.method; // Get the HTTP method (GET, POST, PUT, DELETE)

  switch (method) {
    case "POST":
      return paymentIntent(event); // Handle POST request

    default:
      return {
        success: false,
        message: "Method not allowed for /api/stripe",
      };
  }
});
