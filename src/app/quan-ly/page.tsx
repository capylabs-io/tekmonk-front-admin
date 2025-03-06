"use client";

import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { ROUTE } from "@/contants/router";
import { useEffect } from "react";

export default function Admin() {
  const router = useCustomRouter();

  useEffect(() => {
    router.push(ROUTE.ADMIN + ROUTE.ACCOUNT);
  }, [router]);
  return <>This page will redirect to manage account page</>;
}
