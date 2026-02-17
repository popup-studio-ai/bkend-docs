import type {
  PresignedUrlResponse,
  FileRecord,
} from "@/application/dto/file.dto";

let nextId = 1;

export function getPresignedUrl(
  filename: string,
): PresignedUrlResponse {
  const key = `mock/${Date.now()}-${filename}`;
  return {
    url: `https://picsum.photos/800/600?random=${nextId++}`,
    key,
    filename,
    contentType: "image/jpeg",
  };
}

export function saveFileMetadata(
  data: Record<string, unknown>
): Omit<FileRecord, "url"> & { id: string } {
  const id = `file-${String(nextId++).padStart(3, "0")}`;
  return {
    id,
    originalName: (data.originalName as string) || "",
    mimeType: (data.mimeType as string) || "image/jpeg",
    size: (data.size as number) || 0,
    visibility: (data.visibility as string) || "public",
    createdAt: new Date().toISOString(),
  };
}

export function getDownloadUrl(fileId: string): { url: string } {
  return {
    url: `https://picsum.photos/800/600?random=${fileId}`,
  };
}
