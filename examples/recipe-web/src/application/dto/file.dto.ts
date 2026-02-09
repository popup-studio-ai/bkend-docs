export interface PresignedUrlRequest {
  filename: string;
  contentType: string;
}

export interface PresignedUrlResponse {
  url: string;
  fileKey: string;
}

export interface FileMetadataRequest {
  fileKey: string;
  filename: string;
  contentType: string;
  size: number;
}

export interface FileMetadata {
  id: string;
  fileKey: string;
  filename: string;
  contentType: string;
  size: number;
  url: string;
  createdAt: string;
}
