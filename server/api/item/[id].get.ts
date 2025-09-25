import { defineEventHandler, setResponseStatus, getRouterParam, createError } from "h3";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const prisma = event.context.prisma;

    if (!id) {
        setResponseStatus(event, 400);
        return {
            success: false,
            error: "User ID is required", 
        };
    }

    try {
        const item = await prisma.abstractItem.findUnique({
            where: { id },
            include: {
                ItemVariants: true,
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