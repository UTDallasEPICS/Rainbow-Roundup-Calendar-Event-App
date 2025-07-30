import { defineEventHandler, setResponseStatus, readMultipartFormData } from "h3";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { User } from "../../../types/session";
import { getServerSession } from "#auth";
import { jobs } from "googleapis/build/src/apis/jobs";

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
    const form = await readMultipartFormData(event);

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

        // get file from form data
        const file = form?.find((key) => key.name === "image");

        if (!file || !file.data || !file.filename) {
            setResponseStatus(event, 400);
            return {
                success: false,
                error: "No file uploaded",
            }
        }

        // upload file to s3 bucket
        const objectKey = `itemPhotos/${Date.now}-${file.filename}`;
        const bucketName = config.NUXT_AWS_S3_BUCKET_NAME!;
        const region = config.AWS_REGION!;
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
            Body: file.data,
            ContentType: file.type,
        });
        s3.send(command);

        // create record in table
        const s3url = `https://${bucketName}.s3.${region}.amazonaws.com/${objectKey}`;
        const itemPhoto = await prisma.itemPhoto.create({
            data: {
                url: s3url,
                itemId: id,
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
