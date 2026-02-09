import { apiClient } from "@/infrastructure/api/client";
import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  FileMetadataRequest,
  FileMetadata,
} from "@/application/dto/file.dto";

export const filesApi = {
  getPresignedUrl(data: PresignedUrlRequest): Promise<PresignedUrlResponse> {
    return apiClient<PresignedUrlResponse>("/v1/files/presigned-url", {
      method: "POST",
      body: data,
    });
  },

  async uploadToPresignedUrl(
    url: string,
    file: File,
    contentType: string
  ): Promise<void> {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error("File upload failed.");
    }
  },

  saveMetadata(data: FileMetadataRequest): Promise<FileMetadata> {
    return apiClient<FileMetadata>("/v1/files", {
      method: "POST",
      body: data,
    });
  },

  async upload(file: File): Promise<FileMetadata> {
    const { url, fileKey } = await this.getPresignedUrl({
      filename: file.name,
      contentType: file.type,
    });

    await this.uploadToPresignedUrl(url, file, file.type);

    const metadata = await this.saveMetadata({
      fileKey,
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });

    return metadata;
  },
};
