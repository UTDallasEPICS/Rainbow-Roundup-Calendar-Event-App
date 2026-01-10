import { defineEventHandler, readBody } from "h3";
import Stripe from "stripe"; // Stripe import for TypeScript
import { prisma } from '~/server/utils/prisma';
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!);


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Get cart items from request
  if(!body.orderId){
    setResponseStatus(event, 400);
    return {
      error: "Please provide an order id"
    }
  }
  const order = await prisma.order.findUnique({
    where: {
      id: body.orderId
    },
    include: {
      OrderItems: {
        include: {
          ItemVariants: {
            include: {
              item: true
            }
          },
        },
      }
    },
  })
  if(!order){
    setResponseStatus(event, 400);
    return {
      error: "Order not found"
    }
  }
  if(order.status === "PAID"){
    setResponseStatus(event, 400);
    return {
      error: "Payment for order is already completed"
    }
  }
  if(order.status === "DELIVERED"){
    setResponseStatus(event, 400);
    return {
      error: "Order is already delivered"
    }
  }
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`, // TODO: Build the success and cancel pages
    cancel_url: `${process.env.URL}/cancel`,
    line_items: order.OrderItems.map(item => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: item.ItemVariants.item.price,
        product_data: {
          name: item.ItemVariants.item.name,
          description: item.ItemVariants.item.description,
          // Optional: Add description, images, etc.
        }
      }
    }))
  });
  return {url: session.url}
  
});
