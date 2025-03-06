"use client";

import React from "react";
import { CommonButton } from "../common/button/CommonButton";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children?: React.ReactNode;
  bgImage?: string;
};

const IconShowBanner = () => {
  return (
    <>
      <Image
        alt="character"
        src="/image/landing/human1.png"
        width={323}
        height={220}
        className="object-contain absolute -bottom-[90px] -right-10 z-10 lg:block hidden"
      />
      <Image
        alt="icon-left"
        src="/image/landing/left-stars.png"
        width={89}
        height={87}
        className="object-contain absolute left-20 top-20 z-0 lg:block hidden"
      />
      <Image
        alt="icon-middle"
        src="/image/landing/middle-stars.png"
        width={89}
        height={87}
        className="object-contain absolute left-48 top-3/4 z-0 lg:block hidden"
      />
      <Image
        alt="icon-right"
        src="/image/landing/right-stars.png"
        width={89}
        height={87}
        className="object-contain absolute right-10 top-36 z-0 lg:block hidden"
      />
    </>
  );
};
export const BannerCard = ({ children, className, bgImage }: Props) => {
  return (
    <div className={cn("overflow-hidden w-full h-[560px] relative", className)}>
      <div
        className="h-full bg-cover bg-no-repeat flex flex-col items-center justify-center gap-9 overflow-hidden"
        style={{
          backgroundImage: `url(${
            bgImage || "/image/landing/main-banner.png"
          })`,
        }}
      >
        {children}
      </div>
      {/* Show icon, character here */}
      <IconShowBanner />
    </div>
  );
};
