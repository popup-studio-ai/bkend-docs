import { create } from "zustand";

interface UiState {
  isSidebarOpen: boolean;
  isCartDrawerOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewProductId: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: false,
  isCartDrawerOpen: false,
  isQuickViewOpen: false,
  quickViewProductId: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  openQuickView: (productId) =>
    set({ isQuickViewOpen: true, quickViewProductId: productId }),
  closeQuickView: () =>
    set({ isQuickViewOpen: false, quickViewProductId: null }),
}));
