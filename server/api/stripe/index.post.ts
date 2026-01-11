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
              item: {
                include: {
                  ItemPhotos: true
                }
              }
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
    success_url: `${process.env.URL}/merchandise/checkoutsuccess?session_id={CHECKOUT_SESSION_ID}`, // TODO: Build the success and cancel pages
    cancel_url: `${process.env.URL}/cancel`, // The url if the user cancels the payment
    // Collect billing address
    billing_address_collection: 'required', 
    
    // Collect shipping address (optional)
    shipping_address_collection: {
      allowed_countries: ['US'], // List countries we ship, using 2 digit country codes, 
    },
    line_items: order.OrderItems.map(item => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: item.ItemVariants.item.price * 100,
        product_data: {
          name: item.ItemVariants.item.name,
          description: item.ItemVariants.item.description,
          images: item.ItemVariants.item.ItemPhotos ? item.ItemVariants.item.ItemPhotos.map(photo => `${process.env.URL}${photo.url}`) : [],
          // Optional: Add description, images, etc.
        }
      }
    })),
    metadata: {
      orderId: body.orderId
    }
  });
  //console.log(session)
  return {url: session.url}
  
});
