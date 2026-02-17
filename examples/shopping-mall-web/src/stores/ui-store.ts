import { create } from "zustand";

interface UiState {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  isCartDrawerOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewProductId: string | null;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  mobileSidebarOpen: false,
  isCartDrawerOpen: false,
  isQuickViewOpen: false,
  quickViewProductId: null,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  openQuickView: (productId) =>
    set({ isQuickViewOpen: true, quickViewProductId: productId }),
  closeQuickView: () =>
    set({ isQuickViewOpen: false, quickViewProductId: null }),
}));
