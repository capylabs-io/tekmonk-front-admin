import { useUserStore } from "@/store/UserStore";
import { useEffect } from "react";

export const useLogin = () => {
  const login = useUserStore((state) => state.login);

  useEffect(() => {
    const body = {};
    const loginRequest = async () => {
      await login(body);
    };
    loginRequest();
  }, [login]);
  return null;
};
