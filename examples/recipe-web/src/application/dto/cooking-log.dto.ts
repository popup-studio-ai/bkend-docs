export interface CookingLogDto {
  id: string;
  recipeId: string;
  rating: number; // 1~5
  notes: string;
  cookedAt: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCookingLogInput {
  recipeId: string;
  rating: number;
  notes?: string;
  cookedAt?: string; // ISO 8601, default: now
}
