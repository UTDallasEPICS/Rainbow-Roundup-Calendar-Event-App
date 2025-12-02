import { defineEventHandler, setResponseStatus, getRouterParam, createError } from "h3";
import type { User } from "../../../types/session";
import { auth } from "~/server/auth"
export default defineEventHandler(async (event) => {
    const orderId = getRouterParam(event, "id"); 
    const session = await auth.api.getSession({
      headers:  event.headers
    })
    const user = session?.user as User | undefined;
    const prisma = event.context.prisma;

    if (!orderId) {
        setResponseStatus(event, 400);
        return {
            success: false,
            error: "Order ID is required",
        };
    }

    try {
        const order = await prisma.order.findUnique({
            where: { 
                id: orderId
             },
            include: {
                OrderItems: {
                    include: {
                        ItemVariants: {
                            include: { item: true },
                        },
                    },
                },
                User: true,
            },
        });

        // Auth check
        if (!user?.role || (user.role !== "SUPER" && user.role !== "ADMIN" && user.id !== order?.User.id)) {
            throw createError({
                statusMessage: "Unauthenticated",
                statusCode: 403,
            });
        }

        setResponseStatus(event, 200);
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
