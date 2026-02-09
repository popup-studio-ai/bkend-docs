import type {
  PresignedUrlResponse,
  FileMetadata,
} from "@/application/dto/file.dto";

let nextId = 1;

export function getPresignedUrl(
  filename: string,
): PresignedUrlResponse {
  const fileKey = `mock/${Date.now()}-${filename}`;
  return {
    url: `https://picsum.photos/800/600?random=${nextId++}`,
    fileKey,
  };
}

export function saveFileMetadata(
  data: Record<string, unknown>
): FileMetadata {
  const now = new Date().toISOString();
  return {
    id: `file-${String(nextId++).padStart(3, "0")}`,
    fileKey: (data.fileKey as string) || "",
    filename: (data.filename as string) || "",
    contentType: (data.contentType as string) || "image/jpeg",
    size: (data.size as number) || 0,
    url: `https://picsum.photos/800/600?random=${nextId}`,
    createdAt: now,
  };
}
