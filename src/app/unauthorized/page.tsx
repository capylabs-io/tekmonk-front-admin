"use client";
import { CommonButton } from "@/components/common/button/CommonButton";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { Role } from "@/contants/role";
import { ROUTE } from "@/contants/router";
import { useUserStore } from "@/store/UserStore";
import { useEffect, useState } from "react";

export default function Unauthorized() {
  const router = useCustomRouter();
  const [isClient, setIsClient] = useState(false);
  /** Handle redirect user follow role */
  const [userInfo, isConnected, clear] = useUserStore((state) => [
    state.userInfo,
    state.isConnected,
    state.clear,
  ]);
  const [myUrl, setMyUrl] = useState<string>("");
  const handleRedirect = () => {
    if (!isConnected || myUrl === "") {
      router.push(ROUTE.LOGIN);
      return;
    }
    router.push(myUrl);
    return;
  };

  const handleLogin = () => {
    clear();
    router.push(ROUTE.LOGIN);
  };

  useEffect(() => {
    setIsClient(true);
    if (!isConnected()) {
      router.push(ROUTE.LOGIN);
      return;
    }
    if (userInfo?.user_role?.code === Role.CLASSMANAGEMENT) {
      setMyUrl(ROUTE.MANAGE_CLASS);
      router.push(ROUTE.MANAGE_CLASS);
      return;
    } else if (userInfo?.user_role?.code === Role.TEACHER) {
      setMyUrl(ROUTE.MY_CLASS);
      return;
    } else {
      setMyUrl(ROUTE.LOGIN);
    }
  }, [userInfo, isConnected]);
  return (
    isClient && (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="space-y-4 max-w-md">
          <h1 className="text-4xl font-bold tracking-tight text-tekdojo-700">
            401 - Unauthorized
          </h1>
          <p className="text-lg text-muted-foreground">
            Bạn không có quyền truy cập vào trang này. Vui lòng sử dụng tải
            khoản khác để truy cập hoặc quay về trang của bạn.
          </p>
          <div className="flex mt-4 gap-4 items-center justify-center">
            {isConnected() && (
              <CommonButton variant="secondary" onClick={handleRedirect}>
                Quay về trang của tôi
              </CommonButton>
            )}
            <CommonButton onClick={handleLogin}>Đăng nhập</CommonButton>
          </div>
        </div>
      </div>
    )
  );
}
