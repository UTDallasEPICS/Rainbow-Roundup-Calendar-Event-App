import type { User } from "../../../types/session";
import { auth } from "~/server/auth"

const config = useRuntimeConfig();

export default defineEventHandler(async (event: any) => {
    const prisma = event.context.prisma;
    const session = await auth.api.getSession({
      headers:  event.headers
    })
    const user = session?.user as User | undefined;
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
        return {
            success: false,
            error: "Item ID is required",
        };
    }

    try {
        const item = await prisma.abstractItem.findUnique({
            where: {
                id: itemId,
            }
        });

        if (!item) {
            setResponseStatus(event, 400);
            return {
                success: false,
                errror: "Item record does not exist",
            };
        }

        const allowedTypes = ["image/jpeg", "image/png"];
        const storage = useStorage("uploads");
        const MAX_FILE_SIZE = 256 * 1024; // 256kb

        // get file from form data
        const file = form?.find((key: any) => key.name === "image");

        if (!file || !file.data || !file.filename) {
            setResponseStatus(event, 400);
            return {
                success: false,
                error: "No file uploaded",
            }
        }
        
        if (file.data.length > MAX_FILE_SIZE) {
            setResponseStatus(event, 400);
            return { error: "File too big" };
        }

        if (!file.type || !allowedTypes.includes(file.type)) {
            setResponseStatus(event, 400);
            return {
                error: `File type ${file.type || "unknown"} not allowed. Allowed types: ${allowedTypes.join(", ")}`
            };
        }
        const safeOriginalName = (file.filename || "upload").replace(/[^\w.\-]/g, "_");
        const fileName = `${Date.now()}-${safeOriginalName}`;
        await storage.setItemRaw(fileName, file.data);
        const fileUrl = `${config.UPLOAD_DIR}/${fileName}`;

        const itemPhoto = await prisma.itemPhoto.create({
            data: {
                url: fileUrl,
                itemId: itemId,
            }
        });

        setResponseStatus(event, 200);
        return {
            success: true,
            data: itemPhoto,
        }
    } catch (error) {
        const errorMessage = error instanceof Error? error.message : "Unknown error occurred";
        setResponseStatus(event, 500);
        return {
            success: false,
            error: `Error creating item photo: ${errorMessage}`,
        };
    }
});
