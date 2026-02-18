// Article categories
export const CATEGORIES = [
  { value: "Technology", label: "Technology" },
  { value: "Lifestyle", label: "Lifestyle" },
  { value: "Travel", label: "Travel" },
  { value: "Food", label: "Food" },
] as const;

export const ALL_CATEGORIES_OPTION = {
  value: "__all__",
  label: "All Categories",
} as const;

// Reading speed (words per minute)
export const READING_SPEED_WPM = 200;

// Pagination
export const ITEMS_PER_PAGE = 10;

// File upload
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

// Search
export const SEARCH_DEBOUNCE_MS = 300;

// Timeline
export const TIMELINE_PAGE_SIZE = 10;

// Demo account (password change & account deletion disabled)
export const DEMO_EMAIL = "demo@bkend.ai";
