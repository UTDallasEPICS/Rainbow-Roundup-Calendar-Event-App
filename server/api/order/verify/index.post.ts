import { defineEventHandler, readBody } from "h3";
import Stripe from "stripe"; // Stripe import for TypeScript
import { auth } from "~/server/auth";
import { prisma } from '~/server/utils/prisma';
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
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!);

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers
    })
    const user = session?.user 
    if (!(user?.role === "SUPER" || user?.role === "ADMIN")) { // This can be a mildly heavy api, we dont want random people spamming it
        setResponseStatus(event, 400);
        return {
            error: "Not authenticated"
        }
    }
    const body = await readBody(event);
    if (!body.email) {
        setResponseStatus(event, 400);
        return {
            error: "No customer email provided provided"
        }
    }
    if (!body.orderId) {
        setResponseStatus(event, 400);
        return {
            error: "No customer orderId provided provided"
        }
    }
    const sessions = await stripe.checkout.sessions.list({
        customer_details: { // This is not strictly needed, but it filters the information we will get and therefore need to deal with
            email: body.email
        },
        limit: 100, // assuming the customer has not made 100 other order attempts, this will be fine. Limit can be removed if needed.
        expand: ['data.payment_intent']
    });
    const targetSession = sessions.data.find(
        session => session.metadata && session.metadata.orderId === body.orderId
    );
    const updateData: any = {};
    updateData.status = "PAID"
    const shippingAddress = formatAddress(targetSession?.customer_details?.address);
    if (shippingAddress) {
        updateData.shippingAddress = shippingAddress // I remember Kimberly asking for shipping address on all orders (including pickup)
    }
    if (targetSession && targetSession.payment_status === 'paid') {
        const res = await prisma.order.update({
            where: {
                id: body.orderId
            },
            data: updateData

        })
        return targetSession.payment_status;
    } else {
        setResponseStatus(event, 400);
        return { error: 'Payment not completed' };
    }
})