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
    const form = await readMultipartFormData(event);

    if (!user?.role || (user.role !== "SUPER" && user.role !== "ADMIN")) {
        throw createError({
            statusMessage: "Unauthenticated",
            statusCode: 403,
        });
    }

    const itemId = form?.find((key: any) => key.name === "itemId")?.data.toString();

    if (!itemId) {
        setResponseStatus(event, 400);
        return { error: "Item ID is required", };
    }

    const item = await prisma.abstractItem.findUnique({
        where: { id: itemId, }
    });

    if (!item) {
        setResponseStatus(event, 404);
        return { error: "Item record does not exist", };
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    const MAX_FILE_SIZE = 256 * 1024; // 256kb

    const file = form?.find((key: any) => key.name === "image");


    if (!file) return (setResponseStatus(event, 400), { error: "No file" });
    if (!file.data?.length) return (setResponseStatus(event, 400), { error: "Empty upload" });
    if (file.data.length > MAX_FILE_SIZE) return (setResponseStatus(event, 400), { error: "File too big" });
    if (!file.type || !allowedTypes.includes(file.type)) {
        setResponseStatus(event, 400);
        return { error: `File type ${file.type || "unknown"} not allowed` };
    }

    const safeOriginalName = (file.filename || "upload").replace(/[^\w.\-]/g, "_");
    const key = `/${Date.now()}-${safeOriginalName}`;
    const fileDir = path.join(
        config.UPLOAD_DIR || "public/uploads",
        user.id
    );
    
    if (!fs.existsSync(fileDir)){ // Create user directory if it does not exist
        fs.mkdirSync(fileDir, {recursive: true}); // added recursive parameter to multiple directories if needed (ie when uploads directory is not yet there)
    }
    const filePath = path.join(
        fileDir,
        key
    );

    fs.writeFileSync(filePath, file.data);

    const fileUrl = "/"+path.join(
        (process.env.NUXT_NODE_ENV == "dev") ? "uploads" : config.UPLOAD_DIR,
        user.id,
        key
    );

    const itemPhoto = await prisma.itemPhoto.create({
        data: {
            url: fileUrl,
            itemId: itemId,
        }
    });
    return { data: itemPhoto };
});
