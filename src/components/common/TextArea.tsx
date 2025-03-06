import classNames from "classnames";
import { Info } from "lucide-react";
import React from "react";

const BASE_CLASS = "relative w-full";
const BASE_INPUT_CLASS =
  "rounded-xl border border-grey-300 bg-grey-50 p-3 outline-none min-h-[100px] resize-none";
type Props = {
  value?: string;
  customClassName?: string;
  customInputClassName?: string;
  error?: string;
  placeHolder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  required?: boolean;
  [key: string]: unknown;
};

export const TextArea: React.FC<Props> = ({
  value,
  error,
  placeHolder,
  disabled,
  onChange,
  customClassName,
  customInputClassName,
  ...rest
}) => {
  const handleOnChange = (value: string) => {
    onChange && typeof onChange === "function" && onChange(value);
  };
  return (
    <>
      <div className={classNames(BASE_CLASS, customClassName)}>
        <textarea
          value={value}
          placeholder={placeHolder}
          disabled={disabled}
          className={classNames(
            BASE_INPUT_CLASS,
            customInputClassName,
            error &&
              "border-red-500 focus:border-red-500 text-sm focus:border-2",
            value &&
              !error &&
              "border-green-500 focus:green-500 text-sm focus:border-2"
          )}
          {...rest}
          onChange={(e) => handleOnChange(e.target.value)}
        />
        {error && (
          <div className="pointer-events-none absolute right-0 top-3 flex items-start pr-3">
            <Info size={20} className="text-red-500" />
          </div>
        )}
      </div>
      {error && <p className="mt-2 self-start text-sm text-red-600">{error}</p>}
    </>
  );
};
