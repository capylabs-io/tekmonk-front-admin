import { create } from "zustand";

interface TagStore {
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export const useTagStore = create<TagStore>((set) => ({
  selectedTag: null,
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}));
