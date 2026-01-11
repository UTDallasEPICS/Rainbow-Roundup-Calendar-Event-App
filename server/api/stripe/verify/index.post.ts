import { defineEventHandler, readBody } from "h3";
import Stripe from "stripe"; // Stripe import for TypeScript
import { prisma } from '~/server/utils/prisma';
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!);

function formatAddress(address: Stripe.Address | null | undefined) {
  if (!address) return 'No address provided';
  
  const components = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country
  ];
  
  // Filter out any undefined or empty components
  return components
    .filter(component => component && component.trim() !== '')
    .join(', ');
}
export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if(!body.sessionId){
        setResponseStatus(event, 400);
        console.log("No session id provided")
        return {
            error: "No session id provided"
        }
    }
    const session = await stripe.checkout.sessions.retrieve(body.sessionId);
    const orderId = session?.metadata?.orderId
    console.log("order id: ",orderId)
    if(!orderId){
        setResponseStatus(event, 400);
        console.log("No orderId can be connected to the order")
        return {
            error: "No orderId can be connected to the order"
        }
    }
    // Check if the session was paid
    const updateData: any = {};
    updateData.status = "PAID"
    const shippingAddress = formatAddress(session.customer_details?.address);
    if(shippingAddress){
        updateData.shippingAddress = shippingAddress // I remember Kimberly asking for shipping address on all orders (including pickup)
    }
    if (session.payment_status === 'paid') {
        const res = await prisma.order.update({
            where: {
                id: orderId
            },
            data: updateData
            
        })
        console.log(res)
        console.log(updateData)
        return {session };
    } else {
        setResponseStatus(event, 400);
        return {error: 'Payment not completed' };
    }
})