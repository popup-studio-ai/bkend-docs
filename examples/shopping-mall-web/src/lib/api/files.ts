import { apiClient } from "@/infrastructure/api/client";
import type { PresignedUrlResponse } from "@/application/dto/file.dto";

export const filesApi = {
  async getPresignedUrl(
    filename: string,
    contentType: string
  ): Promise<PresignedUrlResponse> {
    return apiClient<PresignedUrlResponse>("/v1/files/presigned-url", {
      method: "POST",
      body: { filename, contentType },
    });
  },

  async uploadFile(file: File): Promise<string> {
    const { url } = await this.getPresignedUrl(file.name, file.type);

    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    return url.split("?")[0];
  },
};
