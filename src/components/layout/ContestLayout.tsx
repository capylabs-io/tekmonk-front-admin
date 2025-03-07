"use client";

import { Nunito_Sans } from "next/font/google";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../common/button/Button";
import { useUserStore } from "@/store/UserStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { Link as LinkToScroll } from "react-scroll";
import { useCustomRouter } from "../common/router/CustomRouter";
const nunitoSans = Nunito_Sans({
  // weight: "600",
  subsets: ["latin"],
  variable: "--font-nunito",
});

type ContestLayoutProps = {
  children: React.ReactNode;
};

const ContestLayout = ({ children }: ContestLayoutProps) => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const is_show_full = process.env.NEXT_PUBLIC_SHOW_FULL_CONTEST == "true";
  //use state
  const [isClient, setIsClient] = useState(false);
  const [clear, isConnected] = useUserStore((state) => [
    state.clear,
    state.isConnected,
  ]);

  //use store
  const [success] = useSnackbarStore((state) => [state.success]);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const isSubmitted = useUserStore((state) => state.isSubmitted);
  const email = useUserStore((state) => state.userInfo?.email);
  //handle function
  const handleLogout = () => {
    clear();
    success("Success", "Đăng xuất thành công");
    router.push("/dang-nhap");
  };
  const redirectContest = () => {
    //handle if user is not at main page =>  refirect to main page
    if (pathname != "/") {
      router.push("/");
      return;
    }
    return;
  };

  return (
    isClient && (
      <div
        className={`${nunitoSans.variable} font-sans relative w-full h-full flex flex-col overflow-hidden`}
      >
        <main className="flex-grow relative z-0 container w-full mx-auto text-gray-800 bg-opacity-80 min-h-[calc(100vh)] ">
          {children}
        </main>
      </div>
    )
  );
};

export default ContestLayout;
