import { defineEventHandler, setResponseStatus, getRouterParam, createError, readBody } from "h3";
import type { User } from "../../../types/session";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id"); 
    const prisma = event.context.prisma;
    const session = await getServerSession(event);
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

    try {
        const body = await readBody(event);

        if (!body.status && !body.paymentInfo && !Array.isArray(body.orderItems)) {
            setResponseStatus(event, 400);
            return {
                success: false,
                error: "Must include at least one field to update (status, paymentInfo, or orderItems).",
            };
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: body.status,
                paymentInfo: body.paymentInfo,
            },
        });

        if (Array.isArray(body.orderItems)) {
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
                        FinishedItems: {
                            include: { item: true },
                        },
                    },
                },
            },
        });

        setResponseStatus(event, 200);
        return {
            success: true,
            order: fullOrder,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        setResponseStatus(event, 500);
        return {
            success: false,
            error: errorMessage,
        };
    }
});
