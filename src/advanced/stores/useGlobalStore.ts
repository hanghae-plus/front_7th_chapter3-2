import { create } from "zustand";

interface GlobalStoreState {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const useGlobalStore = create<GlobalStoreState>((set) => ({
  isAdmin: false,
  setIsAdmin: (isAdmin: boolean) => set({ isAdmin }),
}));
