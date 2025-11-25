import { defineEventHandler, setResponseStatus, getRouterParam, createError } from "h3";
import { auth } from "~/server/auth"
import type { User } from "../../../types/session";
//import { getServerSession } from "next-auth";

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
            where: { 
                id,
             },
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

        // only admin/super can access archives
        if (item.isArchived)
        {
            //const session = await getServerSession(event);
            const session = await auth.api.getSession({
                  headers:  event.headers
            })
            const user = session?.user as User | undefined;

            if (!user || (!["SUPER", "ADMIN"].includes(user.role) && user.id !== id)) {
            throw createError({
                statusCode: 403,
                statusMessage: "Unauthenticated",
            });
            }
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