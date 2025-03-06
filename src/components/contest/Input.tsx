"use client";
import classNames from "classnames";
import React, { forwardRef, useState } from "react";

type Props = {
  value?: string;
  type: string;
  customInputClassNames?: string;
  customClassNames?: string;
  error?: string;
  placeholder?: string;
  name?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
};

const BASE_CLASS =
  "w-full rounded-xl border border-grey-300 bg-grey-50 p-3 outline-none min-h-[48px]";
const BASE_INPUT_CLASS =
  "mr-2 w-full text-lg font-normal outline-none bg-grey-50";

export const Input = forwardRef<HTMLInputElement, Props>( // Forward the ref
  (
    {
      value,
      error,
      type = "text",
      onChange,
      placeholder,
      onBlur,
      name = "",
      customInputClassNames,
      customClassNames,
    },
    ref // Receive the ref here
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value;
      onChange && onChange(newVal);
    };

    const handleOnBlur = () => {
      onBlur && onBlur();
    };

    const handleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <>
        <div
          className={classNames(
            BASE_CLASS,
            error &&
              "border-red-500 focus:border-red-500 text-sm focus:border-2",
            value &&
              !error &&
              "border-green-400 focus:border-green-400 focus:border-2",
            customClassNames
          )}
        >
          <div className="flex w-full items-center text-base font-bold">
            <input
              type={showPassword ? "text" : type}
              lang="en-US"
              className={classNames(BASE_INPUT_CLASS, customInputClassNames)}
              placeholder={placeholder || ""}
              value={value}
              name={name}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              ref={ref}
            />
          </div>
        </div>
        {error && (
          <p className="mt-2 self-start text-sm text-red-600">{error}</p>
        )}
      </>
    );
  }
);

Input.displayName = "Input"; // Set display name for debugging
