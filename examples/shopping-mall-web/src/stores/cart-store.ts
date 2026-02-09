import { create } from "zustand";

interface CartState {
  itemCount: number;
  setItemCount: (count: number) => void;
  increment: () => void;
  decrement: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,
  setItemCount: (count) => set({ itemCount: count }),
  increment: () => set((state) => ({ itemCount: state.itemCount + 1 })),
  decrement: () =>
    set((state) => ({ itemCount: Math.max(0, state.itemCount - 1) })),
}));
