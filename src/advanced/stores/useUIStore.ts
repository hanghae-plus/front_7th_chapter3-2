import { create } from "zustand";

interface UIStoreState {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  isAdmin: false,
  setIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
}));
