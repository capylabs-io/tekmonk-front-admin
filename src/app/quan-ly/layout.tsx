"use client";

import { LoginGuard } from "@/components/hoc/login-guard";

export default function QuanLyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LoginGuard>{children}</LoginGuard>;
}
