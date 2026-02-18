export interface PresignedUrlRequest {
  filename: string;
  contentType: string;
}

export interface PresignedUrlResponse {
  url: string;
  key: string;
  fileId: string;
}
