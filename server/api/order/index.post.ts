import { defineEventHandler, setResponseStatus, createError, readBody } from "h3";
import type { User } from "../../../types/session";
import { authClient } from "~/server/auth"

export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma;
    const { data: session } = await authClient.getSession();
    const user = session?.user as User | undefined;

    if (!user?.role) {
        throw createError({
            statusMessage: "Unauthenticated",
            statusCode: 403,
        });
    }

    try {
        const body = await readBody(event);

        if (
            !body?.userId ||
            !body?.status ||
            !Array.isArray(body?.orderItems)
        ) {
            setResponseStatus(event, 400);
            return {
                success: false,
                error: "Invalid request. Must include userId, status, and orderItems[].",
            };
        }

        if (body.orderItems.length === 0) {
            setResponseStatus(event, 400);
            return {
                success: false,
                error: "orderItems[] must contain at least one item.",
            };
        }

        const order = await prisma.order.create({
            data: {
                userId: body.userId,
                status: body.status,            
                paymentInfo: body.paymentInfo ?? null,
                OrderItems: {
                    create: body.orderItems.map(
                        (oi: { finishedItemsId: string }) => ({
                            finishedItemsId: oi.finishedItemsId,
                        })
                    ),
                },
            },
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

        setResponseStatus(event, 201);
        return {
            success: true,
            data: order,
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
