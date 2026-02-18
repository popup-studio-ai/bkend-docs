export interface PresignedUrlRequest {
  filename: string;
  contentType: string;
  fileSize: number;
  visibility: "public" | "private";
  category: string;
}

export interface PresignedUrlResponse {
  url: string;
  key: string;
  filename: string;
  contentType: string;
}

export interface CreateFileRequest {
  s3Key: string;
  originalName: string;
  mimeType: string;
  size: number;
  visibility: "public" | "private";
}

export interface FileRecord {
  id: string;
  key: string;
  originalName: string;
  mimeType: string;
  size: number;
  visibility: string;
  url: string;
  createdAt: string;
}
