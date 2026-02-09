export interface ShoppingItem {
  name: string;
  amount: string;
  unit: string;
  checked: boolean;
  recipeId: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  date: string;
  items: ShoppingItem[];
  totalItems: number;
  checkedItems: number;
  createdBy: string;
  createdAt: string;
}

export interface CreateShoppingListRequest {
  name: string;
  date: string;
  items: ShoppingItem[];
  totalItems: number;
  checkedItems: number;
}

export interface UpdateShoppingListRequest {
  name?: string;
  items?: ShoppingItem[];
  totalItems?: number;
  checkedItems?: number;
}
