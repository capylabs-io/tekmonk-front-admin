"use client";
import classNames from "classnames";
import { ReactNode } from "react";
import { useCustomRouter } from "../common/router/CustomRouter";
import { useNavbarStore } from "@/store/navbar-store";

type Props = {
  title: string;
  active: boolean;
  iconElement: ReactNode;
  url?: string;
  disabled?: boolean;
  hidden?: boolean;
};
const BASE_CLASS =
  "flex gap-x-3 px-3 py-4 rounded-xl items-center font-medium hover:bg-primary-25 hover:text-primary-600 cursor-pointer";
const DISABLED_CLASS =
  "opacity-50 pointer-events-none cursor-not-allowed hover:bg-transparent hover:text-inherit";

export const MenuCard = ({
  title,
  active,
  url,
  iconElement,
  disabled = false,
  hidden = false,
}: Props) => {
  const router = useCustomRouter();
  const [isExpand, setIsExpand] = useNavbarStore((state) => [
    state.isExpand,
    state.setIsExpand,
  ]);
  const handleOnClick = () => {
    if (disabled) return;
    setIsExpand(!isExpand);
    url && router.push(url);
  };

  if (hidden) {
    return null;
  }

  return (
    <div
      className={classNames(
        BASE_CLASS,
        active && !disabled && "bg-primary-25 text-primary-600",
        disabled && DISABLED_CLASS
      )}
      onClick={handleOnClick}
      aria-disabled={disabled}
    >
      {iconElement}
      {title && (
        <span className={`${isExpand ? "block" : "hidden"} xl:block`}>
          {title}
        </span>
      )}
    </div>
  );
};
