import { defineEventHandler, setResponseStatus, createError } from "h3";
import type { User } from "@prisma/client";
import { auth } from "~/server/auth"

export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma;
    
    try {
        const session = await auth.api.getSession({
            headers:  event.headers
        })
        const user = session?.user as User | undefined;
        
        if (!user || !["SUPER", "ADMIN"].includes(user.role)) {
            throw createError({
            statusCode: 403,
            statusMessage: "Unauthenticated",
            });
        }
        
        const items = await prisma.abstractItem.findMany({
            where: {
                isArchived: true
            },
            include: {
                ItemVariants: true,
                ItemPhotos: true,
            },
            orderBy: {
                name: "asc",
            },
        });

        setResponseStatus(event, 200);
        return {
            success: true,
            data: items,
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
