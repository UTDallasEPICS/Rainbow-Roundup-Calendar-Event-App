// import { defineEventHandler, readMultipartFormData } from "h3";
// import  S3  from "aws-sdk";
// import { v4 as uuidv4 } from "uuid";

// const bucketName = "rainbow-round-up";

// export default defineEventHandler(async (event) => {
//   const formData = await readMultipartFormData(event);
//   const file = formData?.find((f) => f.name === "file");

//   if (!file) {
//     return { error: "No file uploaded" };
//   }

//   const filename = `profile-pics/${uuidv4()}-${file.filename}`;
//   await s3
//     .putObject({
//       Bucket: bucketName,
//       Key: filename,
//       Body: file.data,
//       ContentType: file.type,
//       ACL: "public-read",
//     })
//     .promise();

//   const url = `https://${bucketName}.s3.amazonaws.com/${filename}`;
//   return { url };
// });
