import { defineEventHandler, setResponseStatus, createError, readBody } from "h3";
import type { User } from "@prisma/client";
import { auth } from "~/server/auth"


type OrderItem = {
    itemVariantId: string
    quantity?: number   // optional, default is 1
}
function validateQuantities(items: OrderItem[]): boolean {
    return items.every(item => {
    if (item.quantity === undefined) return true // it is fine if there is no quantity, defaults to 1 in db
    return Number.isFinite(item.quantity) && item.quantity >= 1 // ensures it is a proper number and that it is at least 1
    })
}
export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma;
    const session = await auth.api.getSession({
      headers:  event.headers
    })
    const user = session?.user as User | undefined;

    if (!user?.emailVerified) {
        throw createError({
            statusMessage: "Unauthenticated",
            statusCode: 403,
        });
    }

    try {
        const body = await readBody(event);

        if (
            !Array.isArray(body?.orderItems)
            || !body.orderType
        ) {
            setResponseStatus(event, 400);
            return {
                success: false,
                error: "Invalid request. Must include orderType and orderItems.",
            };
        }

        if (body.orderItems.length === 0) {
            setResponseStatus(event, 400);
            return {
                success: false,
                error: "orderItems[] must contain at least one item.",
            };
        }
        if(body.orderType === "PICKUP"){
            
            if(!body.pickupEventID){
                return{
                    success: false,
                    error: "Pickup orders need to have an associated event"
                }
            }
        }
        if(body.orderType === "DELIVERY"){
            
            if(!body.shippingAddress){
                return{
                    success: false,
                    error: "Delivery orders need to have an address"
                }
            }
        }
        if (!validateQuantities(body.orderItems)) { // Note: no need to validate itemVariantId, since prisma will throw an error with invalid id's
            return {
                success: false,
                error: 'Each quantity, if provided, must be at least 1'
            }
        }

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                status: "UNCONFIRMED",       // All orders are initially unconfirmed
                orderType: body.orderType,
                shippingAddress: body?.shippingAddress, // You need either shippingAddress, or pickupEventId, the other can be null
                pickupEventID: body?.pickupEventID,     
                OrderItems: {
                    create: body.orderItems.map(
                        (oi: { itemVariantId: string, quantity: string }) => ({
                            itemVariantId: oi.itemVariantId,
                            quantity: oi.quantity
                        })
                    ),
                },
            },
            include: {
                OrderItems: {
                    include: {
                        ItemVariants: {
                            include: { item: true },
                        },
                    },
                },
                User: true
            },
        });

        setResponseStatus(event, 201);
        return {
            success: true,
            data: order,
        };
    } catch (error) {
        console.log(error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        setResponseStatus(event, 500);
        return {
            success: false,
            error: errorMessage,
        };
    }
});
