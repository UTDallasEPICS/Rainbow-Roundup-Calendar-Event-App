import { defineEventHandler, readBody } from "h3";
import Stripe from "stripe"; // Stripe import for TypeScript
import { prisma } from '~/server/utils/prisma';
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!);


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let shippingCost = 1000
  // Get cart items from request
  if (!body.orderId) {
    setResponseStatus(event, 400);
    return {
      error: "Please provide an order id"
    }
  }
  const order = await prisma.order.findUnique({
    where: {
      id: body.orderId
    },
    include: { // We need all the connected tables to give stripe as much info as possible when creating their Checkout page
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
  if (!order) {
    setResponseStatus(event, 400);
    return {
      error: "Order not found"
    }
  }
  if(order.orderType === "PICKUP"){
    shippingCost = 0
  }
  if (order.status === "PAID") {
    setResponseStatus(event, 400);
    return {
      error: "Payment for order is already completed"
    }
  }
  if (order.status === "DELIVERED") {
    setResponseStatus(event, 400);
    return {
      error: "Order is already delivered"
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${process.env.URL}/merchandise/checkoutsuccess?session_id={CHECKOUT_SESSION_ID}`, // TODO: Build the success and cancel pages
    cancel_url: `${process.env.URL}/merchandise`, // The url if the user cancels the payment
    billing_address_collection: 'required',
    invoice_creation: {
      enabled: true, // This generates an email with invoice of order after payment is complete
      invoice_data: {
        description:  `Your order id is: ${order.id}`
      }
    },
    
    shipping_address_collection: {
      allowed_countries: ['US'], // List countries we ship, using 2 digit country codes, 
    },
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'USPS Shipping Cost',
          fixed_amount: {
            amount: shippingCost,
            currency: 'USD',
          },
          type: 'fixed_amount',
        },
      },
    ],


    line_items: order.OrderItems.map(item => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: item.ItemVariants.item.price * 100, // adjust to integer value, stripe will adjust it on their checkput page
        product_data: {
          name: item.ItemVariants.item.name, // NOTE: This can be modified to include the size of the itemVariant if we want that to show up in stripe
          description: item.ItemVariants.item.description,
          images: item.ItemVariants.item.ItemPhotos ? item.ItemVariants.item.ItemPhotos.map(photo => `${process.env.URL}/${photo.url}`) : [],
          // The above line is to extract the array of photo url's we have and send it to stripe, if stripe can retrieve the image url's, it will show it on checkout page
          // ${process.env.URL}${photo.url} is essentially combining our domain and relative path from our domain, it relies on our .env to not have a trailing slash
        }
      }
    })),
    metadata: {
      orderId: body.orderId // additionally put our internal order ID into the metadata of the stripe order session, we can retrieve this later to verify orders
    }
  });
  return { url: session.url }

});
