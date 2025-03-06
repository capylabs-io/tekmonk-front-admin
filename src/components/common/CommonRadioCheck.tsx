"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onChecked: boolean;
  className?: string;
}

export const CommonRadioCheck = ({ onChecked, className, ...props }: Props) => {
  return (
    <div
      {...props}
      className={cn(
        className,
        "w-[18px] h-[18px] rounded-[100%] flex items-center justify-center",
        onChecked ? "bg-primary-50" : "border-2 border-gray-30"
      )}
    >
      {onChecked && (
        <Image
          alt=""
          src={"/admin/account/state-checked.png"}
          width={18}
          height={18}
          className="bg-white"
        />
      )}
    </div>
  );
};
