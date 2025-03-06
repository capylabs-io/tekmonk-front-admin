"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CommonButton } from "./button/CommonButton";
import { ROUTE } from "@/contants/router";

export const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== undefined) {
        // If we're scrolling down, hide the navbar
        if (window.scrollY > lastScrollY) {
          setIsVisible(false);
        }
        // If we're scrolling up, show the navbar
        else {
          setIsVisible(true);
        }
        // Update the last scroll position
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== undefined) {
      window.addEventListener("scroll", controlNavbar);

      // Cleanup
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <header
      className={cn(
        "container fixed top-0 h-16 left-0 right-0 bg-white z-50 transition-transform duration-300 flex items-center justify-center",
        !isVisible && "-translate-y-full"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between ">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <Link href="/" className="flex items-center">
              <Image
                src="/image/app-logo.png"
                alt="app logo"
                width={159}
                height={32}
                className="ml-1.5 lg:block hidden"
              />
              <Image
                src="/Logo.png"
                alt="app logo"
                width={34}
                height={32}
                className="ml-1.5 lg:hidden block"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 text-SubheadMd text-gray-95">
              <Link
                href="/khoa-hoc"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Khóa học
              </Link>
              <Link
                href="/olympiad"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Olympiad
              </Link>
              <Link
                href={ROUTE.NEWS}
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Tin tức
              </Link>
              <Link
                href={ROUTE.HIRING}
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Tuyển Dụng
              </Link>
              <Link
                href="/su-kien"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sự kiện
              </Link>
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 w-[200px]">
            <Link
              href="/lien-he"
              className="hidden md:inline-flex text-SubheadMd text-gray-95"
            >
              Liên hệ
            </Link>
            <CommonButton className="h-10 text-white md:block hidden">
              <Link href={ROUTE.LOGIN} className="text-SubheadMd">
                Đăng nhập
              </Link>
            </CommonButton>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
