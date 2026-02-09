export interface Article {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  category?: string;
  isPublished: boolean;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  coverImage?: string;
  category?: string;
  isPublished?: boolean;
  tags?: string[];
}

export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  isPublished?: boolean;
  tags?: string[];
}

export interface ArticleFilters {
  category?: string;
  isPublished?: boolean;
  createdBy?: string;
}
