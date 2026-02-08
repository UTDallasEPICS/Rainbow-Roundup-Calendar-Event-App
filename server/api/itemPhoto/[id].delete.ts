import type { User } from "../../../types/session";
import { auth } from "~/server/auth";
import fs from "fs";
import path from "node:path";

export default defineEventHandler(async (event: any) => {
    const prisma = event.context.prisma;
    const session = await auth.api.getSession({
      headers:  event.headers
    });
    const user = session?.user as User | undefined;
    const config = useRuntimeConfig();

    if (!user?.role || (user?.role !== "SUPER" && user?.role !== "ADMIN")) {
        throw createError({
            statusMessage: "Unauthenticated",
            statusCode: 403,
        });
    }

    const id = getRouterParam(event, "id");

    if (!id) {
        setResponseStatus(event, 400);
        return { error: "ItemPhoto ID is required", };
    }

    const itemPhoto = await prisma.itemPhoto.findUnique({
        where: { id: id, },
    });

    if (!itemPhoto) {
        setResponseStatus(event, 404);
        return { error: "ItemPhoto not found", };
    }

    const filePath = path.join(
        config.UPLOAD_DIR || "public/uploads",
        path.dirname(itemPhoto.url).split("/").at(-1) + "", // extract the user id directory name from itemPhoto, since path.basename strips it
        path.basename(itemPhoto.url)
    );

    try {
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error("Failed to delete file:", error);
    }

    const deletedPhoto = await prisma.itemPhoto.delete({
        where: { id: id, },
    });

    return { success: true, itemPhoto: deletedPhoto, };
});
