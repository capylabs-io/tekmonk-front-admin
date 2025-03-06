"use client";
import classNames from "classnames";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import React, { ReactNode, useState } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  type: string;
  customInputClassNames?: string;
  customClassNames?: string;
  error?: string;
  placeholder?: string;
  name?: string;
  isSearch?: boolean;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  onSearch?: () => void;
  readOnly?: boolean;
}
const BASE_CLASS =
  "w-full rounded-xl border border-grey-300 bg-grey-50 p-3 outline-none min-h-[48px] flex items-center justify-center";
export const Input = ({
  value,
  error,
  type = "text",
  onChange,
  placeholder,
  onBlur,
  name = "",
  isSearch = false,
  customInputClassNames,
  customClassNames,
  readOnly = false,
  onSearch,
  ...props
}: Props) => {
  const [showPassword, setshowPassword] = useState(false);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    onChange && onChange(newVal);
  };
  const handleOnBlur = () => {
    onBlur && onBlur();
  };
  const handleShowPassword = () => {
    setshowPassword((prev) => !prev);
  };
  return (
    <>
      <div
        className={classNames(
          BASE_CLASS,
          error && "border-red-500 focus:border-red-500 text-sm focus:border-2",
          value &&
            !error &&
            "border-green-400 focus:border-green-400 focus:border-2",
          customClassNames // This affects the container div
        )}
      >
        <div className="flex w-full items-center text-BodyMd">
          {isSearch && (
            <Image
              src="/image/contestentries/search-icon.png"
              alt="search icon"
              width={24}
              height={10}
              className="cursor-pointer"
              onClick={onSearch}
            />
          )}
          <input
            type={showPassword ? "text" : type}
            lang="en-US"
            style={{
              outline: "none",
              background: "transparent",
            }}
            className={classNames(
              "mr-2 w-full text-BodyMd bg-grey-50 placeholder:text-gray-70 placeholder:text-BodyMd",
              customInputClassNames
            )}
            placeholder={placeholder || ""}
            value={value}
            name={name}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            readOnly={readOnly}
            {...props}
          />
          {/* {type === "password" && (
            <button type="button" onClick={handleShowPassword}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )} */}
        </div>
      </div>
      {error && <p className="mt-2 self-start text-sm text-red-600">{error}</p>}
    </>
  );
};
