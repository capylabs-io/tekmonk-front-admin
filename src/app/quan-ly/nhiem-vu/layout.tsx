"use client";
import { RoleGuard } from "@/components/hoc/role-guard";
import { Role } from "@/contants/role";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[Role.CLASSMANAGEMENT]}>{children}</RoleGuard>
  );
}
