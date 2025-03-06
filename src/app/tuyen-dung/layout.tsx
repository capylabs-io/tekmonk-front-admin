"use client";
import { Navbar } from "@/components/common/Navbar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto flex flex-col items-center">
      <Navbar />
      {children}
    </div>
  );
}
