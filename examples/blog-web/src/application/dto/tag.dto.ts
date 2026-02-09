export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateTagRequest {
  name: string;
  slug: string;
}
