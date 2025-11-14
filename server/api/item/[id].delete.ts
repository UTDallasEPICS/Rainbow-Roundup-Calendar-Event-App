import { defineEventHandler, setResponseStatus, getRouterParam, createError } from "h3";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { User } from "../../../types/session";
import { authClient } from "~/server/auth"

const config = useRuntimeConfig();
const s3 = new S3Client({
    region: config.AWS_REGION,
    credentials: {
            accessKeyId: config.NUXT_AWS_ACCESS_KEY_ID!,
            secretAccessKey: config.NUXT_AWS_SECRET_ACCESS_KEY!,
    },
});

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");
    const prisma = event.context.prisma;
    const { data: session } = await authClient.getSession();
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
            error: "Item ID is required",
        };
    }

    try {
        const existingItem = await prisma.abstractItem.findUnique({
            where: { id },
        });

        if (!existingItem) {
            setResponseStatus(event, 404);
            return {
                success: false,
                error: "Item not found",
            };
        }

        // set abstract item to archived
        await prisma.abstractItem.update({
            where: { id },
            data: { isArchived: true }
            
        })

        // // delete photos from s3 bucket
        // const itemPhotos : any = prisma.itemPhoto.findMany({
        //     where: {itemId: id},
        //     select: {url: true,},
        // });
        // if (itemPhotos.length === 0) {
        //     setResponseStatus(event, 500);
        //     return {
        //         success: false,
        //         error: "Failed to query itemPhotos",
        //     };
        // }
        // for (const itemPhoto of itemPhotos) {
        //     const search = itemPhoto.url.match(/itemPhotos\/\d+-[^\/?]+/);     // extract key from url
        //     if (!search) {
        //         setResponseStatus(event, 500);
        //         return {
        //             success: false,
        //             error: `Object key was not able to be extracted from s3 url if itemPhoto: ${itemPhoto.id}`,
        //         }
        //     }
        //     const key = search[0];
        //     s3.send(
        //         new DeleteObjectCommand({
        //             Bucket: config.NUXT_AWS_S3_BUCKET_NAME,
        //             Key: key,
        //         }),
        //     );
        // }

        // await prisma.itemVariant.deleteMany({
        //     where: { itemId: id },
        // });

        // await prisma.itemPhoto.deleteMany({
        //     where: { itemId: id },
        // });

        // await prisma.abstractItem.delete({
        //     where: { id },
        // });

        setResponseStatus(event, 200);
        return {
            success: true,
            message: "Item marked as hidden",
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
