"use client";

import { Navbar } from "@/components/common/Navbar";
import { LoginGuard } from "@/components/hoc/login-guard";

export default function QuanLyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex">
      <LoginGuard>
        <Navbar />
        <div className="flex flex-1 border-gray-200 border">{children}</div>
      </LoginGuard>
    </div>
  );
}
