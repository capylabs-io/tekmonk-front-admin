"use client";

import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { LoginGuard } from "@/components/hoc/login-guard";
import { ROUTE } from "@/contants/router";

export default function Page() {
  const router = useCustomRouter();
  router.push(ROUTE.MANAGE_CLASS);
  return (
    <LoginGuard>
      <div>
        <h1>Hello</h1>
      </div>
    </LoginGuard>
  );
}
