import { defineEventHandler, setResponseStatus, getRouterParam, createError } from "h3";
import type { User } from "../../../types/session";
import { auth } from "~/server/auth"

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
            error: "Item ID is required",
        };
    }

    try {
        const existingItem = await prisma.abstractItem.findUnique({
            where: { id },
        });

        if (!existingItem) {
            setResponseStatus(event, 404);
            return {
                success: false,
                error: "Item not found",
            };
        }

        // set abstract item to archived
        await prisma.abstractItem.update({
            where: { id },
            data: { isArchived: true }
            
        })

        setResponseStatus(event, 200);
        return {
            success: true,
            message: "Item marked as hidden",
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
