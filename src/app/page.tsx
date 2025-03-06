"use client";

import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { ROUTE } from "@/contants/router";

export default function Page() {
  const router = useCustomRouter();
  router.push(ROUTE.MANAGE_CLASS);
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
}
