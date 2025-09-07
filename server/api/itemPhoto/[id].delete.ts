import { defineEventHandler, setResponseStatus } from "h3";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

import type { User } from "../../../types/session";
import { getServerSession } from "#auth";

const config = useRuntimeConfig();
const s3 = new S3Client({
    region: config.AWS_REGION,
    credentials: {
            accessKeyId: config.NUXT_AWS_ACCESS_KEY_ID!,
            secretAccessKey: config.NUXT_AWS_SECRET_ACCESS_KEY!,
    },
});

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
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
            error: "ItemPhoto ID is required",
        };
    }

    try {
        const itemPhoto = await prisma.itemPhoto.delete({
            where: {
                id: id,
            }
        });

        // delete photo from s3 bucket
        const search = itemPhoto.url.match(/itemPhotos\/\d+-[^\/?]+/);     // extract key from url
        if (!search) {
            setResponseStatus(event, 500);
            return {
                success: false,
                error: "Object key was not able to be extracted from s3 url",
            }
        }
        const key = search[0];
        s3.send(
            new DeleteObjectCommand({
                Bucket: config.NUXT_AWS_S3_BUCKET_NAME,
                Key: key,
            }),
        );

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
            error: `Error creating event: ${errorMessage}`,
        };
    }
});