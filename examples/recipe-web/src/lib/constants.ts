// Recipe categories
export const RECIPE_CATEGORIES = [
  "Korean",
  "Japanese",
  "Chinese",
  "Western",
  "Italian",
  "Dessert",
  "Salad",
  "Soup",
  "Other",
] as const;

// Difficulty levels
export const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const;

// Meal types
export const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
] as const;

// Pagination
export const ITEMS_PER_PAGE = 12;

// File upload
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

// Search
export const SEARCH_DEBOUNCE_MS = 300;
