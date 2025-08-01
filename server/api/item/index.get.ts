import { defineEventHandler, setResponseStatus, createError } from "h3";
import type { User } from "../../../types/session";
import { getServerSession } from "#auth";
import { asCleanDays } from "@fullcalendar/core/internal";

export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma;
    const session = await getServerSession(event);
    const user = session?.user as User | undefined;

    if (!user?.role || (user.role !== "SUPER" && user.role !== "ADMIN")) {
        throw createError({
            statusMessage: "Unauthenticated",
            statusCode: 403,
        });
    }

    try {
        const items = await prisma.item.findMany({
            include: {
                FinishedItems: true,
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
