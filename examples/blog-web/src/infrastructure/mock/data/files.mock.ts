import type { PresignedUrlResponse, FileRecord } from "@/application/dto/file.dto";

let fileCounter = 0;

export function createMockPresignedUrl(filename: string): PresignedUrlResponse {
  fileCounter++;
  return {
    url: "https://httpbin.org/put",
    key: `mock-uploads/${fileCounter}-${filename}`,
    filename,
    contentType: "image/png",
  };
}

export function createMockFileRecord(body: Record<string, unknown>): FileRecord {
  fileCounter++;
  const id = `file-${fileCounter}-${Date.now()}`;
  return {
    id,
    originalName: (body.originalName as string) || "uploaded-file.png",
    mimeType: (body.mimeType as string) || "image/png",
    size: (body.size as number) || 0,
    visibility: (body.visibility as string) || "public",
    url: `https://picsum.photos/seed/${id}/800/400`,
    createdAt: new Date().toISOString(),
  };
}
