import { create } from "zustand";

type State = {
  isExpand: boolean;
};

type Actions = {
  setIsExpand: (isExpand: boolean) => void;
};

export const useNavbarStore = create<State & Actions>((set) => ({
  isExpand: false,
  setIsExpand: (isExpand) => set({ isExpand }),
}));
