import { postLogin, getMe } from "@/requests/login";
import { Certificate, User } from "@/types/common-types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Định nghĩa kiểu State và Actions
type State = {
  jwt: string | null;
  userInfo: User | null;
  userCertificate: Certificate[] | null;
};

type Actions = {
  login: (body: any) => Promise<void>;
  clear: () => void;
  getMe: () => Promise<void>;
  isConnected: () => boolean;
};

// Khởi tạo giá trị mặc định cho state
const defaultStates: State = {
  jwt: null,
  userInfo: null,
  userCertificate: null,
};

// Tạo store sử dụng Zustand
export const useUserStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...defaultStates,
      isConnected: () => !!get().jwt && !!get().userInfo,
      login: async (body) => {
        const response = await postLogin(body);
        if (!response) {
          return;
        }
        set({
          jwt: response.jwt,
          userInfo: response.user,
        });
        return response.user;
      },
      clear: () => {
        set({
          ...defaultStates,
        });
      },
      getMe: async () => {
        try {
          const response = await getMe();
          if (response) {
            set({
              userInfo: response,
            });
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      },
    }),
    { name: "userStore" }
  )
);
