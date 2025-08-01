import { defineEventHandler, setResponseStatus, getRouterParam, createError } from "h3";
import type { User } from "../../../types/session";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
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
            error: "User ID is required", 
        };
    }

    try {
        const item = await prisma.item.findUnique({
            where: { id },
            include: {
                FinishedItems: true,
                ItemPhotos: true,
            }
        });

        if (!item) {
            setResponseStatus(event, 404);
            return {
                success: false,
                error: "Order not found",
            };
        }

        setResponseStatus(event, 200);
        return {
            success: true, 
            data: item,
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