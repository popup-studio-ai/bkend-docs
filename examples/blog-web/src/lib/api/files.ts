import { bkendFetch } from "@/infrastructure/api/client";
import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  CreateFileRequest,
  FileRecord,
} from "@/application/dto/file.dto";

async function getPresignedUrl(
  data: PresignedUrlRequest
): Promise<PresignedUrlResponse> {
  return bkendFetch<PresignedUrlResponse>("/v1/files/presigned-url", {
    method: "POST",
    body: data,
  });
}

async function uploadToPresignedUrl(
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };

    xhr.onerror = () => reject(new Error("A network error occurred."));
    xhr.send(file);
  });
}

async function registerFile(data: CreateFileRequest): Promise<FileRecord> {
  return bkendFetch<FileRecord>("/v1/files", {
    method: "POST",
    body: data,
  });
}

export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<FileRecord> {
  const presigned = await getPresignedUrl({
    filename: file.name,
    contentType: file.type,
    fileSize: file.size,
    visibility: "public",
    category: "images",
  });

  await uploadToPresignedUrl(presigned.url, file, onProgress);

  const fileRecord = await registerFile({
    s3Key: presigned.key,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    visibility: "public",
  });

  return fileRecord;
}
