import { defineEventHandler, setResponseStatus, readBody } from "h3";
import type { User } from "../../../types/session";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const prisma = event.context.prisma;
    const session = await getServerSession(event);
    const user = session?.user as User | undefined;
    const body = await readBody(event);

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
        const item = await prisma.item.findUnique({
            where: {
                id: id,
            }
        });

        if (!item) {
            setResponseStatus(event, 400);
            return {
                success: false,
                errror: "Item record does not exist",
            };
        }



        setResponseStatus(event, 201);
        return {
            success: true,
            itemPhoto: itemPhoto,
        };
    } catch (error) {
        const errorMessage = error instanceof Error? error.message : "Unknown error occurred";
        setResponseStatus(event, 500);
        return {
            success: false,
            error: `Error creating item photo: ${errorMessage}`,
        };
    }
});
