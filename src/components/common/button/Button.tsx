"use client";
import classNames from "classnames";
import Image from "next/image";
import React, { PropsWithChildren, ReactNode } from "react";

const styles = {
  "b-wide": "min-w-[200px]",
  "b-small": "text-sm font-medium px-4 !py-1",
  "b-medium": "text-base font-medium px-10 !py-3",
  "b-large": "text-lg font-medium px-14 !py-3",
};

const BASE_CLASS =
  "flex items-center justify-center rounded-xl px-4 py-3 text-center font-semibold";

type Props = {
  className?: string;
  disabled?: boolean;
  outlined?: boolean;
  loading?: boolean;
  size?: "small" | "medium" | "large";
  urlIcon?: string;
  iconElement?: ReactNode;
  onClick?: () => void;
  wide?: boolean;
  style?: React.CSSProperties;
  highlight?: boolean;
  id?: string;
};

export const Button = ({
  disabled,
  size,
  className,
  outlined,
  highlight,
  urlIcon,
  loading,
  wide,
  children,
  onClick,
  iconElement,
  style,
  id,
}: PropsWithChildren<Props>) => {
  const sizes = ["small", "medium", "large"];
  const classes = classNames([
    BASE_CLASS,
    size && sizes.includes(size) ? styles[`b-${size}`] : styles["b-medium"],
    loading || disabled ? "cursor-default opacity-50" : "",
    outlined ? "bg-white text-primary-900" : "bg-primary-600 text-white",
    highlight && "bg-white text-primary-900 border !border-black",
    wide && "w-full",
    className,
  ]);

  const handleOnClick = () => {
    onClick && onClick();
  };
  return (
    <button
      id={id}
      onClick={handleOnClick}
      type="button"
      disabled={disabled || loading}
      className={classes}
      style={style}
    >
      {loading ? (
        <span
          className={classNames(
            "inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent",
            outlined ? "text-black/60" : "text-white"
          )}
          role="status"
          aria-label="loading"
        />
      ) : (
        <div className="flex items-center">
          {urlIcon && (
            <Image
              className="mr-2"
              src={urlIcon}
              width={16}
              height={16}
              alt="button icon"
            />
          )}
          {children}
          {iconElement && iconElement}
        </div>
      )}
    </button>
  );
};
