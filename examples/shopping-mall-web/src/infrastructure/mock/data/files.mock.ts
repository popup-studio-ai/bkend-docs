import type { PresignedUrlResponse } from "@/application/dto/file.dto";

let fileCounter = 1;

export function handleFilesRoutes(
  method: string,
  path: string,
  body?: unknown
): unknown | null {
  if (method === "POST" && path === "/v1/files/presigned-url") {
    const input = body as Record<string, unknown> | undefined;
    const filename = (input?.filename as string) || "file.png";
    const fileId = `file-mock-${fileCounter++}`;

    const response: PresignedUrlResponse = {
      url: `https://picsum.photos/seed/${fileId}/400/400?mock-upload=${encodeURIComponent(filename)}`,
      fileId,
    };
    return response;
  }

  if (method === "POST" && path === "/v1/files") {
    return {
      id: `file-mock-${fileCounter++}`,
      url: "https://picsum.photos/seed/uploaded/400/400",
    };
  }

  return null;
}
