// Product categories
export const PRODUCT_CATEGORIES = [
  { value: "Electronics", label: "Electronics" },
  { value: "Clothing", label: "Clothing" },
  { value: "Food", label: "Food" },
  { value: "Furniture", label: "Furniture" },
  { value: "Books", label: "Books" },
  { value: "Sports", label: "Sports" },
  { value: "Beauty", label: "Beauty" },
  { value: "Other", label: "Other" },
] as const;

export const ALL_CATEGORIES_OPTION = {
  value: "__all__",
  label: "All Categories",
} as const;

// Pagination
export const ITEMS_PER_PAGE = 12;

// Search
export const SEARCH_DEBOUNCE_MS = 300;

// File upload
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

// Google OAuth
export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
export const GOOGLE_SCOPES = "openid email profile";
export const OAUTH_CALLBACK_PATH = "/auth/google/callback";
export const OAUTH_STATE_KEY = "oauth_state";
