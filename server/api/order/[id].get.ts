import { defineEventHandler, setResponseStatus, getRouterParam, createError } from "h3";
import type { User } from "../../../types/session";
import { auth } from "~/server/auth"
export default defineEventHandler(async (event) => {
    const userId = getRouterParam(event, "id"); 
    const session = await auth.api.getSession({
      headers:  event.headers
    })
    const user = session?.user as User | undefined;
    const prisma = event.context.prisma;

    // Auth check
    if (!user?.role || (user.role !== "SUPER" && user.role !== "ADMIN" && user.id !== userId)) {
        throw createError({
            statusMessage: "Unauthenticated",
            statusCode: 403,
        });
    }

    if (!userId) {
        setResponseStatus(event, 400);
        return {
            success: false,
            error: "User ID is required",
        };
    }

    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                OrderItems: {
                    include: {
                        ItemVariants: {
                            include: { item: true },
                        },
                    },
                },
            },
        });

        setResponseStatus(event, 200);
        return {
            success: true,
            data: orders, 
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
