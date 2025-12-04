import { defineEventHandler, setResponseStatus, getRouterParam, createError, readBody } from "h3";
import type { User } from "../../../types/session";
import { auth } from "~/server/auth"
import { OrderType } from "@prisma/client";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id"); 
    const prisma = event.context.prisma;
    const session = await auth.api.getSession({
      headers:  event.headers
    })
    const user = session?.user as User | undefined;

    if (!user?.role || (user.role !== "SUPER" && user.role !== "ADMIN")) {
        throw createError({
            statusMessage: "Unauthenticated",
            statusCode: 403,
        });
    }

    if (!id) {
        setResponseStatus(event, 400);
        return {
            success: false,
            error: "Order ID is required",
        };
    }

    // Authenticate that user calling api has permissions to update the order
    if (user?.role !== "SUPER" && user?.role !== "ADMIN") {
        const order = await prisma.order.findUnique({
            where: {id: id,},
            select: {userId: true,}
        });

        if (order?.userId !== user.id) {
            throw createError({
                statusMessage: "Unauthenticated",
                statusCode: 403,
            });
        }
    }

    try {
        const body = await readBody(event);

        // if (!body.status && !body.paymentInfo && !Array.isArray(body.orderItems)) {
        //     setResponseStatus(event, 400);
        //     return {
        //         success: false,
        //         error: "Must include at least one field to update (status, paymentInfo, or orderItems).",
        //     };
        // }

        const updateData: any = {};
        if (body.status != null) {
            updateData.status = body.status
        }
        if (body.orderType == null) { 
            throw createError({
                statusMessage: "Invalid order type",
                statusCode: 403,
            });
        }
        else {
            updateData.orderType = body.orderType
        }

        if (body.orderType == 'PICKUP' || body.orderType == OrderType.PICKUP ) {
            // check eventID
            const event = await prisma.event.findUnique({
                where: {
                    id: body.pickupEventID
                }
            })
            if (!event) {
                throw createError({
                    statusMessage: "Event id " + body.pickupEventID + " does not exist",
                    statusCode: 403,
                });
            }

            updateData.pickupEventID = body.pickupEventID
            updateData.shippingAddress = null
            updateData.trackingNumber = null 
        }
        else if (body.orderType == 'PICKUP' || body.orderType == OrderType.PICKUP ) {
            if (!body.shippingAddress || body.shippingAddress == 'SHIPING') {
                throw createError({
                    statusMessage: "Event id " + body.pickupEventID + " does not exist",
                    statusCode: 403,
                });
            }

            updateData.pickupEventID = null
            updateData.shippingAddress = body.shippingAddress
            updateData.trackingNumber = body.trackingNumber 
        }
    
        

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: updateData,
        });

        if (Array.isArray(body.orderItems)) {
            if (body.orderItems.length === 0) {
                setResponseStatus(event, 400);
                return {
                    success: false,
                    error: "Must include order items for update",
                };
            }
            await prisma.orderItem.deleteMany({
                where: { orderId: id },
            });

            await prisma.orderItem.createMany({
                data: body.orderItems.map((item: { finishedItemsId: string }) => ({
                    orderId: id,
                    finishedItemsId: item.finishedItemsId,
                })),
            });
        }

        const fullOrder = await prisma.order.findUnique({
            where: { id },
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

        setResponseStatus(event, 200);
        return {
            success: true,
            data: fullOrder, 
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        console.log(error)
        setResponseStatus(event, 500);
        return {
            success: false,
            error: errorMessage,
        };
    }
});
