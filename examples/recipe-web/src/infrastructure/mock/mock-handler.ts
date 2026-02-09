import { createAuthResponse, createMeResponse } from "./data/auth.mock";
import {
  getRecipesList,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "./data/recipes.mock";
import {
  getIngredientsByRecipe,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "./data/ingredients.mock";
import {
  getMealPlansByDateRange,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from "./data/meal-plans.mock";
import {
  getShoppingLists,
  getShoppingListById,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
} from "./data/shopping-lists.mock";
import {
  getCookingLogsByRecipe,
  createCookingLog,
  deleteCookingLog,
} from "./data/cooking-logs.mock";
import { getPresignedUrl, saveFileMetadata } from "./data/files.mock";

const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

export function isMockMode(): boolean {
  return MOCK_MODE;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseSearchParams(path: string): URLSearchParams {
  const idx = path.indexOf("?");
  if (idx === -1) return new URLSearchParams();
  return new URLSearchParams(path.slice(idx + 1));
}

function getPathname(path: string): string {
  const idx = path.indexOf("?");
  return idx === -1 ? path : path.slice(0, idx);
}

export async function handleMockRequest<T>(
  path: string,
  options?: { method?: string; body?: unknown }
): Promise<T> {
  await delay(200 + Math.random() * 300);

  const method = options?.method?.toUpperCase() || "GET";
  const body = options?.body as Record<string, unknown> | undefined;
  const pathname = getPathname(path);
  const params = parseSearchParams(path);

  // --- Auth ---
  if (pathname === "/v1/auth/email/signup" && method === "POST") {
    return createAuthResponse() as T;
  }
  if (pathname === "/v1/auth/email/signin" && method === "POST") {
    return createAuthResponse() as T;
  }
  if (pathname === "/v1/auth/refresh" && method === "POST") {
    const auth = createAuthResponse();
    return { accessToken: auth.accessToken, refreshToken: auth.refreshToken } as T;
  }
  if (pathname === "/v1/auth/me" && method === "GET") {
    return createMeResponse() as T;
  }

  // --- Recipes ---
  const recipesMatch = pathname.match(/^\/v1\/data\/recipes(?:\/(.+))?$/);
  if (recipesMatch) {
    const id = recipesMatch[1];

    if (!id) {
      if (method === "GET") {
        const page = Number(params.get("page")) || 1;
        const limit = Number(params.get("limit")) || 12;
        const sortBy = params.get("sortBy") || "createdAt";
        const sortDirection = (params.get("sortDirection") || "desc") as "asc" | "desc";
        const andFiltersStr = params.get("andFilters");
        const andFilters = andFiltersStr ? JSON.parse(andFiltersStr) : undefined;
        return getRecipesList(page, limit, andFilters, sortBy, sortDirection) as T;
      }
      if (method === "POST") {
        return createRecipe(body || {}) as T;
      }
    } else {
      if (method === "GET") {
        const recipe = getRecipeById(id);
        if (!recipe) throw { statusCode: 404, message: "Recipe not found" };
        return recipe as T;
      }
      if (method === "PATCH") {
        const updated = updateRecipe(id, body || {});
        if (!updated) throw { statusCode: 404, message: "Recipe not found" };
        return updated as T;
      }
      if (method === "DELETE") {
        deleteRecipe(id);
        return undefined as T;
      }
    }
  }

  // --- Ingredients ---
  const ingredientsMatch = pathname.match(
    /^\/v1\/data\/ingredients(?:\/(.+))?$/
  );
  if (ingredientsMatch) {
    const id = ingredientsMatch[1];

    if (!id) {
      if (method === "GET") {
        const page = Number(params.get("page")) || 1;
        const limit = Number(params.get("limit")) || 50;
        const andFiltersStr = params.get("andFilters");
        const andFilters = andFiltersStr ? JSON.parse(andFiltersStr) : {};
        const recipeId = andFilters.recipeId || "";
        return getIngredientsByRecipe(recipeId, page, limit) as T;
      }
      if (method === "POST") {
        return createIngredient(body || {}) as T;
      }
    } else {
      if (method === "GET") {
        const ingredient = getIngredientById(id);
        if (!ingredient) throw { statusCode: 404, message: "Ingredient not found" };
        return ingredient as T;
      }
      if (method === "PATCH") {
        const updated = updateIngredient(id, body || {});
        if (!updated) throw { statusCode: 404, message: "Ingredient not found" };
        return updated as T;
      }
      if (method === "DELETE") {
        deleteIngredient(id);
        return undefined as T;
      }
    }
  }

  // --- Meal Plans ---
  const mealPlansMatch = pathname.match(
    /^\/v1\/data\/meal_plans(?:\/(.+))?$/
  );
  if (mealPlansMatch) {
    const id = mealPlansMatch[1];

    if (!id) {
      if (method === "GET") {
        const page = Number(params.get("page")) || 1;
        const limit = Number(params.get("limit")) || 50;
        const andFiltersStr = params.get("andFilters");
        let startDate = "2025-01-01";
        let endDate = "2025-12-31";
        if (andFiltersStr) {
          try {
            const filters = JSON.parse(andFiltersStr);
            if (filters.date) {
              startDate = filters.date.$gte || startDate;
              endDate = filters.date.$lte || endDate;
            }
          } catch {
            // ignore parse error
          }
        }
        return getMealPlansByDateRange(startDate, endDate, page, limit) as T;
      }
      if (method === "POST") {
        return createMealPlan(body || {}) as T;
      }
    } else {
      if (method === "GET") {
        const plan = getMealPlanById(id);
        if (!plan) throw { statusCode: 404, message: "Meal plan not found" };
        return plan as T;
      }
      if (method === "PATCH") {
        const updated = updateMealPlan(id, body || {});
        if (!updated) throw { statusCode: 404, message: "Meal plan not found" };
        return updated as T;
      }
      if (method === "DELETE") {
        deleteMealPlan(id);
        return undefined as T;
      }
    }
  }

  // --- Shopping Lists ---
  const shoppingMatch = pathname.match(
    /^\/v1\/data\/shopping_lists(?:\/(.+))?$/
  );
  if (shoppingMatch) {
    const id = shoppingMatch[1];

    if (!id) {
      if (method === "GET") {
        const page = Number(params.get("page")) || 1;
        const limit = Number(params.get("limit")) || 20;
        return getShoppingLists(page, limit) as T;
      }
      if (method === "POST") {
        return createShoppingList(body || {}) as T;
      }
    } else {
      if (method === "GET") {
        const list = getShoppingListById(id);
        if (!list) throw { statusCode: 404, message: "Shopping list not found" };
        return list as T;
      }
      if (method === "PATCH") {
        const updated = updateShoppingList(id, body || {});
        if (!updated) throw { statusCode: 404, message: "Shopping list not found" };
        return updated as T;
      }
      if (method === "DELETE") {
        deleteShoppingList(id);
        return undefined as T;
      }
    }
  }

  // --- Cooking Logs ---
  const cookingLogsMatch = pathname.match(
    /^\/v1\/data\/cooking_logs(?:\/(.+))?$/
  );
  if (cookingLogsMatch) {
    const id = cookingLogsMatch[1];

    if (!id) {
      if (method === "GET") {
        const page = Number(params.get("page")) || 1;
        const limit = Number(params.get("limit")) || 20;
        const andFiltersStr = params.get("andFilters");
        const andFilters = andFiltersStr ? JSON.parse(andFiltersStr) : {};
        const recipeId = andFilters.recipeId || "";
        return getCookingLogsByRecipe(recipeId, page, limit) as T;
      }
      if (method === "POST") {
        return createCookingLog(body || {}) as T;
      }
    } else {
      if (method === "DELETE") {
        deleteCookingLog(id);
        return undefined as T;
      }
    }
  }

  // --- Files ---
  if (pathname === "/v1/files/presigned-url" && method === "POST") {
    const filename = (body?.filename as string) || "image.jpg";
    return getPresignedUrl(filename) as T;
  }
  if (pathname === "/v1/files" && method === "POST") {
    return saveFileMetadata(body || {}) as T;
  }

  // --- Fallback ---
  console.warn(`[Mock] Unhandled request: ${method} ${pathname}`);
  throw { statusCode: 404, message: `Mock handler not found: ${method} ${pathname}` };
}
