import { create } from "zustand";

type State = {
  isShowing: boolean;
  content: string;
};

type Actions = {
  show: () => void;
  hide: () => void;
};

export const useProfileStore = create<State & Actions>((set) => ({
  isShowing: false,
  content: "",
  show: () =>
    set({
      isShowing: true,
    }),
  hide: () =>
    set({
      isShowing: false,
      content: "",
    }),
}));
