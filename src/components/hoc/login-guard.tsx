"use client";

import { useUserStore } from "@/store/UserStore";
import { useEffect, useState } from "react";
import { useCustomRouter } from "../common/router/CustomRouter";
import { ROUTE } from "@/contants/router";
import { useSnackbarStore } from "@/store/SnackbarStore";
export const LoginGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useCustomRouter();
  const isConnected = useUserStore((state) => state.isConnected);
  const [warn] = useSnackbarStore((state) => [state.warn]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (!isConnected()) {
      warn("Lỗi", "Bạn vui lòng đăng nhập để tiếp tục");
      router.push(ROUTE.LOGIN);
    }
    setIsAuthenticated(true);
  }, []);
  return isAuthenticated ? children : null;
};
