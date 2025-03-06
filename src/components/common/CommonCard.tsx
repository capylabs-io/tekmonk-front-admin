"use client";

import { cn } from "@/lib/utils";

interface CommonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  size?: "small" | "medium" | "large";
  isActive?: boolean;
}

export const CommonCard: React.FC<CommonCardProps> = ({
  children,
  className,
  size = "medium",
  isActive = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        className,
        "hover:cursor-pointer",
        isActive ? "bg-primary-60 text-gray-00" : "border-gray-30",
        isActive ? "" : size === "small" ? "border rounded" : "border-2",
        size === "medium" && "rounded-2xl",
        size === "large" && "rounded-3xl"
        // Add a class if isActive is true
      )}
      style={{
        boxShadow: isActive
          ? "none"
          : size === "small"
          ? "0px 2px 0px #DDD0DD"
          : size === "medium"
          ? "0px 4px 0px #DDD0DD"
          : "0px 8px 0px #DDD0DD",
      }}
      {...props}
    >
      {children}
    </div>
  );
};
