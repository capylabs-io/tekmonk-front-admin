"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCustomRouter } from "@/components/common/router/CustomRouter";
import { ROUTE } from "@/contants/router";
import { MenuCard } from "@/components/home/MenuCard";
import { Bell, Goal, Home, Newspaper, ShoppingCart, User } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <section className="w-full flex min-h-screen mx-auto">
        <div className="flex-1 overflow-y-auto border-gray-200 border">
          {children}
        </div>
      </section>
    </QueryClientProvider>
  );
}
