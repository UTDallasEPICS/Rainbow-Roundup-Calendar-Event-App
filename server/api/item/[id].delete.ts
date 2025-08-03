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
            error: "Item ID is required",
        };
    }

    try {
        const existingItem = await prisma.item.findUnique({
            where: { id },
        });

        if (!existingItem) {
            setResponseStatus(event, 404);
            return {
                success: false,
                error: "Item not found",
            };
        }

        await prisma.finishedItem.deleteMany({
            where: { itemId: id },
        });

        await prisma.itemPhoto.deleteMany({
            where: { itemId: id },
        });

        await prisma.item.delete({
            where: { id },
        });

        setResponseStatus(event, 200);
        return {
            success: true,
            message: "Item and its related finishedItems and itemPhotos deleted successfully",
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
