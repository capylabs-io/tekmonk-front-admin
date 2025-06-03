import { Class } from "@/types/common-types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  currentClass: Class | undefined;
};

type Actions = {
  setCurrentClass: (currentClass: Class) => void;
};

export const useClassStore = create<State & Actions>()(
  persist(
    (set) => ({
      currentClass: undefined,
      setCurrentClass: (data: Class) =>
        set({
          currentClass: data,
        }),
    }),
    { name: "classStore" }
  )
);
