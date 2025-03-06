"use client";

import { Navbar } from "@/components/common/Navbar";

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto flex flex-col items-center">
      <Navbar />
      {children}
    </div>
  );
}
