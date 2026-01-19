import { defineEventHandler, readBody } from "h3";
import Stripe from "stripe"; // Stripe import for TypeScript
import { auth } from "~/server/auth";
import { prisma } from '~/server/utils/prisma';
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!);

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers
    })
    const user = session?.user 
    if (!(user?.role === "SUPER" || user?.role === "ADMIN")) { // since this sends to all users, only admins can do it
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
        customer_details: {
            email: body.email
        },
        limit: 50,
        expand: ['data.payment_intent']
    });
    const targetSession = sessions.data.find(
        session => session.metadata && session.metadata.orderId === body.orderId
    );
    const updateData: any = {};
    updateData.status = "PAID"
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