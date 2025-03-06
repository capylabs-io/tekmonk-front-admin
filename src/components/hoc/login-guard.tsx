"use client";

import { useUserStore } from "@/store/UserStore";
import { useEffect } from "react";
import { useCustomRouter } from "../common/router/CustomRouter";
import { ROUTE } from "@/contants/router";
import { Loading } from "../common/Loading";
import { useSnackbarStore } from "@/store/SnackbarStore";
export const LoginGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useCustomRouter();
  const isConnected = useUserStore((state) => state.isConnected);
  const [warn] = useSnackbarStore((state) => [state.warn]);
  if (!isConnected()) {
    warn("Lỗi", "Bạn vui lòng đăng nhập để tiếp tục");
    router.push(ROUTE.LOGIN);
  }
  return <>{children}</>;
};
