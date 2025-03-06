"use client";

import { cn } from "@/lib/utils";

export const CommonTag = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        className,
        "rounded-[4px] bg-gray-20 text-gray-95 text-BodyXs flex items-center h-6 px-2"
      )}
    >
      {children}
    </div>
  );
};
