# AWS S3 Integration Setup Guide

This guide walks you through setting up AWS S3 for backend or frontend integration with your Nuxt project. You'll create a new S3 bucket, configure CORS, create an IAM user with full S3 access, and store credentials securely in environment variables.

---

## 1. Create a New S3 Bucket

1. Go to the [AWS Console](https://console.aws.amazon.com/).
2. Navigate to **S3** under "Services".
3. Click **Create bucket**:
   - **Bucket name**: `rainbow-round-up` (or any unique name)
   - **Region**: `us-east-1`
   - Uncheck **Block all public access** if you want public file access (optional)
4. Click **Create bucket** to finish.

---

## 2. Configure CORS for the Bucket

1. In the S3 dashboard, open your bucket.
2. Go to the **Permissions** tab → scroll to **Cross-origin resource sharing (CORS)**.
3. Click **Edit** and paste the following:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]
```

> You may limit `AllowedOrigins` to your frontend domain instead of `*` for stricter security.

---

## 3. Create an IAM User with S3 Access

1. Go to **IAM** via AWS Console.
2. Click **Users** → **Add users**:
   - **Username**: `nuxt-s3-access` (or any name)
   - Enable **Programmatic access**
3. Click **Next: Permissions**:
   - Select **Attach policies directly**
   - Search for and check **AmazonS3FullAccess**
4. Click through the rest and **Create user**.
5. Save the **Access key ID** and **Secret access key**. You’ll need these below.

---

## 4. Add Environment Variables

In your `.env` file, add the following values:

```env
NUXT_AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
NUXT_AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
NUXT_AWS_S3_BUCKET_NAME="rainbow-round-up"
AWS_REGION="us-east-1"
```

**Example:**

```env
NUXT_AWS_ACCESS_KEY_ID="blah"
NUXT_AWS_SECRET_ACCESS_KEY="blah"
NUXT_AWS_S3_BUCKET_NAME="rainbow-round-up"
AWS_REGION="us-east-1"
```

> **DO NOT** commit this file or these credentials to GitHub. Use `.gitignore` to exclude your `.env`.

---

## 5. Test Integration

Once your environment is set up:

- Ensure your backend can authenticate with AWS using the credentials.
- Use the AWS SDK to upload/download objects, or generate pre-signed URLs for secure client-side uploads.

---
