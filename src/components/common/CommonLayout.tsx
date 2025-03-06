import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  Bell,
  Bookmark,
  User,
  MoreHorizontal,
  PenSquare,
} from "lucide-react";
import type React from "react"; // Import React

interface LayoutProps {
  leftSidebar: React.ReactNode;
  mainContent: React.ReactNode;
  rightSidebar: React.ReactNode;
}

export default function CommonLayout({
  leftSidebar,
  mainContent,
  rightSidebar,
}: LayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto flex">  
        {/* Left Sidebar */}
        <div className="md:block sticky top-0 hidden h-screen">
          {leftSidebar}
        </div>

        {/* Main Content */}
        <main className="flex-1 border-x">
          <div className="mx-auto max-w-3xl overflow-y-auto">{mainContent}</div>˜
        </main>

        {/* Right Sidebar */}
        <div className="sticky top-0 hidden h-screen w-[350px] border-l p-4 xl:block">
          {rightSidebar}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t bg-background p-4 md:hidden">
          <Link href="/" className="p-2">
            <Home className="h-6 w-6" />
          </Link>
          <Link href="/notifications" className="p-2">
            <Bell className="h-6 w-6" />
          </Link>
          <Link href="/bookmarks" className="p-2">
            <Bookmark className="h-6 w-6" />
          </Link>˜
          <Link href="/profile" className="p-2">
            <User className="h-6 w-6" />
          </Link>
        </nav>
      </div>
    </div>
  );
}
