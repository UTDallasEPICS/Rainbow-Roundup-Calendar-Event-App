import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.NUXT_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NUXT_AWS_SECRET_ACCESS_KEY!,
  },
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ fileName: string; fileType: string }>(event);

    if (!body.fileName || !body.fileType) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing fileName or fileType in request body",
      });
    }

    const bucketName = process.env.NUXT_AWS_S3_BUCKET_NAME!;
    const region = process.env.AWS_REGION!;
    const objectKey = `profile-pictures/${body.fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: body.fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${objectKey}`;

    return {
      uploadUrl: signedUrl,
      fileUrl,
    };
  } catch (err: any) {
    console.error("S3 signing error:", err);

    throw createError({
      statusCode: err?.$metadata?.httpStatusCode || 500,
      statusMessage: err?.message || "Unexpected error generating signed URL",
      data: err,
    });
  }
});
