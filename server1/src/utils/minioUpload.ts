// File: src/utils/minioUpload.ts
import minioClient from "../clients/minio"; // tumhara jo client setup file hai
import path from "path";

const BUCKET_NAME = "filorafiles"; // apna bucket name

// Ensure bucket exists
async function ensureBucketExists() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, "us-east-1"); // region as needed
    console.log(`Bucket '${BUCKET_NAME}' created.`);
  }
}

/**
 * Upload a file buffer or path to MinIO
 * @param fileBuffer Buffer | string (file path)
 * @param originalName original file name (for extension)
 * @returns objectKey jo Redis me store karenge (direct storage key)
 */
export async function uploadFileToMinio(
  fileBuffer: Buffer | string,
  originalName: string
): Promise<string> {
  await ensureBucketExists();

  // ✅ Direct storage key - extension ke saath original name use karo
  const extension = path.extname(originalName); // .jpg, .pdf etc
  const objectKey = `profiles/${Date.now()}-${originalName}`;

  // Upload file
  if (fileBuffer instanceof Buffer) {
    await minioClient.putObject(BUCKET_NAME, objectKey, fileBuffer);
  } else if (typeof fileBuffer === "string") {
    // agar file path diya hai
    await minioClient.fPutObject(BUCKET_NAME, objectKey, fileBuffer);
  } else {
    throw new Error("Invalid file input, must be Buffer or path string");
  }

  console.log(`File '${originalName}' uploaded to MinIO as '${objectKey}'`);
  return objectKey; // ✅ Direct storage key return karo
}

/**
 * Delete a file from MinIO
 * @param objectKey stored file key (UUID + extension)
 */
export async function deleteFileFromMinio(objectKey: string): Promise<void> {
  try {
    // Check if bucket exists before delete
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      console.warn(`⚠️ Bucket '${BUCKET_NAME}' does not exist.`);
      return;
    }

    await minioClient.removeObject(BUCKET_NAME, objectKey);
    console.log(`🗑️ File '${objectKey}' deleted from MinIO.`);
  } catch (err: any) {
    console.error(
      `❌ Failed to delete '${objectKey}' from MinIO:`,
      err.message
    );
    throw new Error("Failed to delete file from MinIO");
  }
}

/**
 * ✅ Get file URL from storage key (server ke through serve karo)
 */
export function getFileUrl(objectKey: string): string {
  // Tumhara server route jo files serve karega
  return `/api/files/${encodeURIComponent(objectKey)}`;
}

/**
 * ✅ Generate unique but readable storage key
 */
export function generateStorageKey(
  prefix: string,
  originalName: string,
  userId?: string
): string {
  const extension = path.extname(originalName);
  const timestamp = Date.now();

  if (userId) {
    return `${prefix}/${userId}-${timestamp}${extension}`;
  }

  return `${prefix}/${timestamp}-${originalName}`;
}
