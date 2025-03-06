import { create } from "zustand";

// Define the State and Actions types
type State = {
  page: number;
};

type Actions = {
  prevPage: () => void;
  nextPage: () => void;
};

// Initialize default state values
const defaultStates: State = {
  page: 1,
};

// Create the store using Zustand
export const useProgressNumber = create<State & Actions>((set, get) => ({
  ...defaultStates,

  // Handle if page > 1 => can prevPage
  prevPage: () => {
    if (get().page > 1) {
      set({ page: get().page - 1 });
    }
  },

  // Handle if page < 3 => can nextPage
  nextPage: () => {
    if (get().page < 3) {
      set({ page: get().page + 1 });
    }
  },
}));
