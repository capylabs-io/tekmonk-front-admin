"use client";

import { useUserStore } from "@/store/UserStore";
import { Nunito_Sans } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const nunitoSans = Nunito_Sans({
  // weight: "600",
  subsets: ["latin"],
  variable: "--font-nunito",
});

const ContestHeader = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isConnected = useUserStore((state) => state.isConnected);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  };

  const handleLogout = () => {
    useUserStore.getState().clear();
    router.push("/dang-nhap");
  };

  return (
    <>
      <TooltipProvider>
        {isClient && (
          <div
            className={`${nunitoSans.variable} font-sans relative w-full h-full flex flex-col`}
          >
            <Image
              src="/image/contest/layer_bg.png"
              alt="Background"
              fill
              priority
              quality={40}
              className="object-cover"
            />

            {/* Header */}
            <div className="relative z-10 h-16 w-full flex items-center justify-between px-4 sm:px-12 border-b bg-white bg-opacity-80">
              <Image
                src="/image/app-logox2.png"
                alt="app logo"
                width={159}
                height={32}
                className="hover:cursor-pointer h-8 w-40"
                onClick={() => router.push("/home")}
              />

              {/* Desktop Menu */}
              <div className="hidden sm:flex w-96 h-full items-center justify-around text-gray-950">
                <div
                  className="text-gray-950 text-bodyLg cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  Thể lệ
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="cursor-pointer"
                      onClick={() => router.push("/")}
                    >
                      Tổng hợp bài dự thi
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sắp diễn ra</p>
                  </TooltipContent>
                </Tooltip>

                {!isConnected() ? (
                  <div
                    className="cursor-pointer"
                    onClick={() => router.push("/dang-nhap")}
                  >
                    Đăng nhập
                  </div>
                ) : (
                  <div
                    className="cursor-pointer text-red-600"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={toggleMenu} className="sm:hidden text-gray-950">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
              <div
                className="fixed inset-0 bg-slate-400 bg-opacity-60 z-20"
                onClick={toggleMenu}
              />
            )}

            {/* Mobile Menu */}
            <div
              className={`fixed flex flex-col justify-between z-30 right-0 w-2/3 h-full bg-white shadow-md border-t border-gray-200 transition-transform duration-300 ease-in-out ${
                isMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <ul className="flex flex-col items-center py-2 text-gray-950">
                <li
                  className="py-2 w-full flex justify-center items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => router.push("/")}
                >
                  Thể lệ
                </li>

                <li
                  className="py-2 w-full flex justify-center items-center cursor-pointer hover:bg-gray-100"
                  // onClick={() => router.push("/contest")}
                >
                  Tổng hợp bài dự thi
                </li>
                {!isConnected() ? (
                  <li
                    className="py-2 w-full flex justify-center items-center cursor-pointer hover:bg-gray-100"
                    onClick={() => router.push("/dang-nhap")}
                  >
                    Đăng nhập
                  </li>
                ) : (
                  <li
                    className="py-2 w-full flex justify-center items-center cursor-pointer hover:bg-gray-100 text-red-600"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </li>
                )}
              </ul>
            </div>

            {/* Main Content */}
            {/* <main className="flex-grow relative z-0 max-w-[1440px] w-full mx-auto border border-t-0 border-gray-300 text-gray-800 bg-white bg-opacity-80">
        {children}
      </main> */}
          </div>
        )}
      </TooltipProvider>
    </>
  );
};

export default ContestHeader;
