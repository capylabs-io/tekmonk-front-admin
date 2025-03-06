import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { localKanitFont } from "@/fonts";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "destructiveSecondary";
  outlined?: boolean;
  childrenClassName?: string;
  wrapperClassName?: string;
  disabled?: boolean;
}

export const CommonButton = ({
  className,
  childrenClassName,
  wrapperClassName,
  variant = "primary",
  disabled,
  children,
  ...props
}: ButtonProps) => {
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-lg duration-200 cursor-pointer text-SubheadSm",
        "text-center flex items-center justify-center",
        {
          " border-[1px] bg-[#BC4CAC] hover:bg-primary-70 text-white border-primary-70 shadow-custom-primary":
            variant === "primary" && !disabled,
          " border-[2px] bg-gray-00 hover:bg-gray-10 active:bg-gray-20 text-primary-95 border-gray-20 shadow-custom-gray":
            variant === "secondary",
          " border-[2px] bg-gray-00 hover:bg-[#FDA29B]  text-[#B42419] border-[#FDA29B] shadow-custom-destructive":
            variant === "destructive",
          " border-[2px] bg-[#E5473C] hover:bg-[#AD3C34]  text-gray-00 border-[#AD3C34] shadow-custom-destructive-secondary":
            variant === "destructiveSecondary",
        },
        wrapperClassName
      )}
    >
      <button
        type="button"
        className={cn(
          childrenClassName,
          localKanitFont.className,
          {
            "text-white": variant === "primary",
            "text-gray-00": variant === "destructiveSecondary",
            "text-primary-95": variant === "secondary",
            "text-[#B42419]": variant === "destructive",
          },
          "!cursor-pointer w-full h-full flex items-center justify-center",
          { "cursor-not-allowed": disabled }
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    </div>
  );
};
