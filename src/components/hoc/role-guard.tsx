"use client";

import { useSnackbarStore } from "@/store/SnackbarStore";
import { useCustomRouter } from "../common/router/CustomRouter";

import { useUserStore } from "@/store/UserStore";
import { ROUTE } from "@/contants/router";
import { useEffect, useState } from "react";
import { Role } from "@/contants/role";

type RoleGuardProps = {
  children: React.ReactNode;
  allowedRoles: Role[];
};

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const router = useCustomRouter();
  const [userInfo, clear] = useUserStore((state) => [
    state.userInfo,
    state.clear,
  ]);
  const [warn] = useSnackbarStore((state) => [state.warn]);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Skip authorization check if userInfo is not yet loaded
    if (!userInfo) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    // Only perform the authorization check if we have user info
    if (!allowedRoles.includes(userInfo?.user_role?.code as Role)) {
      warn("Lỗi", "Bạn không có quyền truy cập vào trang này");
      router.push(ROUTE.UNAUTHORIZED);
    } else {
      setIsAuthorized(true);
    }
  }, [userInfo, allowedRoles]);

  // Show nothing while loading or if not authorized
  if (isLoading || !isAuthorized) return null;

  return <>{children}</>;
};
