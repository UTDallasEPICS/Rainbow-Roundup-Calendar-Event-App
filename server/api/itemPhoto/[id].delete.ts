import type { User } from "../../../types/session";
import { auth } from "~/server/auth"

export default defineEventHandler(async (event: any) => {
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

    const id = getRouterParam(event, "id");

    if (!id) {
        setResponseStatus(event, 400);
        return {
            success: false,
            error: "ItemPhoto ID is required",
        };
    }

    try {
        const itemPhoto = await prisma.itemPhoto.delete({
            where: {
                id: id,
            }
        });

        const storage = useStorage("uploads");
        const fileName = itemPhoto.url.split("/").pop();

        if (fileName) {
            await storage.removeItem(fileName);
        }

        setResponseStatus(event, 200);
        return {
            success: true,
            itemPhoto: itemPhoto,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        setResponseStatus(event, 500);
        return {
            success: false,
            error: `Error deleting item photo: ${errorMessage}`,
        };
    }
});
