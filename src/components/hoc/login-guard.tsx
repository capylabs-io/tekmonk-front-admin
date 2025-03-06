"use client";

import { useUserStore } from "@/store/UserStore";
import { useEffect } from "react";
import { useCustomRouter } from "../common/router/CustomRouter";
import { ROUTE } from "@/contants/router";
import { Loading } from "../common/Loading";
export const LoginGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useCustomRouter();
  const isConnected = useUserStore((state) => state.isConnected);

  if (!isConnected()) {
    router.push(ROUTE.LOGIN);
  }
  return <>{children}</>;
};
