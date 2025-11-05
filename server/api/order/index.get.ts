import { defineEventHandler, setResponseStatus, createError } from "h3";
import type { User } from "../../../types/session";
import { authClient } from "~/server/auth"

export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma;
    const { data: session } = await authClient.getSession();
    const user = session?.user as User | undefined;

    // Auth check: only SUPER or ADMIN
    if (!user?.role || (user.role !== "SUPER" && user.role !== "ADMIN")) {
        throw createError({
            statusMessage: "Unauthenticated",
            statusCode: 403,
        });
    }

    try {
        const orders = await prisma.order.findMany({
            include: {
                OrderItems: {
                    include: {
                        FinishedItems: {
                            include: {
                                item: true,
                            },
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
