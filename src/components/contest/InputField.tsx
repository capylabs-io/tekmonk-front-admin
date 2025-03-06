import React, { forwardRef, useMemo } from "react";
import { Controller } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Input } from "../common/Input";

type Props = {
  title: string;
  value?: string;
  type: "text" | "text-area";
  customInputClassNames?: string;
  customClassNames?: string;
  error?: string;
  placeholder?: string;
  name?: string;
  control?: any;
  isRequired?: boolean;
  isTooltip?: boolean;
  tooltipContent?: string;
  onChange?: (e: any) => void;
  props?: any;
};

export const InputField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  Props
>(
  (
    {
      title,
      value,
      error,
      type = "text",
      control,
      placeholder,
      isRequired,
      name = "",
      customInputClassNames,
      customClassNames,
      isTooltip = false,
      tooltipContent,
      onChange,
      ...props
    },
    ref
  ) => {
    const ReactQuill = useMemo(
      () => dynamic(() => import("react-quill"), { ssr: false }),
      []
    );

    const modules = {
      toolbar: [
        [{ list: "ordered" }, { list: "bullet" }], // Hỗ trợ bullet và numbered lists
        ["bold", "italic", "underline"],
        [{ header: [1, 2, 3, false] }],
        ["link", "image"],
      ],
    };
    const formats = [
      "list", // Bao gồm cả 'ordered' và 'bullet'
      "bullet",
      "ordered",
      "bold",
      "italic",
      "underline",
      "header",
      "link",
      "image",
    ];

    return (
      <TooltipProvider>
        <div
          className={`flex flex-wrap sm:flex-nowrap items-start ${customClassNames}`}
        >
          <label
            htmlFor={name}
            className="text-SubheadSm text-gray-60 w-1/4 flex item-center gap-x-1"
          >
            {title}
            {isTooltip ? (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info
                      size={14}
                      className={`mt-0.5`}
                      color={`${isRequired ? "#f70000" : "#0000f7"}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    align="start"
                    className="max-w-[200px]"
                  >
                    <p>{tooltipContent}</p>
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
              <>
                <span className="text-red-500">{isRequired ? " *" : ""}</span>{" "}
              </>
            )}
          </label>
          <div className="flex flex-col w-full max-w-3/4 overflow-hidden">
            {control ? ( // If control is passed, use Controller
              <Controller
                name={name}
                control={control}
                render={({ field }) =>
                  type === "text-area" ? (
                    <ReactQuill
                      theme="snow"
                      value={field.value || value || ""}
                      className="w-full rounded-xl border border-grey-300 bg-grey-50 outline-none min-h-[200px]"
                      onChange={field.onChange}
                      placeholder={placeholder}
                      modules={modules}
                      formats={formats}
                    />
                  ) : (
                    <Input
                      {...field}
                      type={type}
                      value={value}
                      placeholder={placeholder}
                      customInputClassNames={`${customInputClassNames}`}
                      customClassNames={`h-10 flex items-center ${customInputClassNames}`}
                    />
                  )
                }
              />
            ) : type === "text-area" ? (
              <ReactQuill
                theme="snow"
                className="w-full rounded-xl bg-grey-50 outline-none !text-[20px] min-h-[200px] transition-all ease-linear"
                value={value}
                onChange={onChange} // Handle value change as needed
                placeholder={placeholder}
                modules={modules}
                formats={formats}
                {...props}
              />
            ) : (
              <Input
                value={value}
                type={type}
                placeholder={placeholder}
                customInputClassNames={`${customInputClassNames}`}
                customClassNames={`h-10 flex items-center !text-SubheadSm ${customInputClassNames}`}
                onChange={onChange}
                {...props}
              />
            )}
            {/* Display error message */}
            {error && <p className="text-red-500 text-xs mr-10">{error}</p>}
          </div>
        </div>
      </TooltipProvider>
    );
  }
);

// Add displayName for better debugging in React DevTools
InputField.displayName = "InputField";
