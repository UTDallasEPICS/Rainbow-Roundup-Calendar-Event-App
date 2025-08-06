import { defineEventHandler, setResponseStatus, getRouterParam, createError } from "h3";
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
        const existingOrder = await prisma.order.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existingOrder) {
            setResponseStatus(event, 404);
            return {
                success: false,
                error: "Order not found",
            };
        }

        await prisma.orderItem.deleteMany({
            where: { orderId: id },
        });

        await prisma.order.delete({
            where: { id },
        });

        setResponseStatus(event, 200);
        return {
            success: true,
            message: "Order and related order items deleted successfully",
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
