"use client";
import { Button } from "@/components/common/button/Button";
import classNames from "classnames";
import { X } from "lucide-react";
import React from "react";

type Props = {
  title: string;
  value?: File | null;
  customInputClassNames?: string;
  customClassNames?: string;
  error?: string;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
};

const MAX_FILE_SIZE_MB = parseInt(
  process.env.NEXT_PUBLIC_MAX_FILE_SIZE || "10"
);

const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

export const InputFileUploadContest = ({
  title,
  value,
  error: initialError,
  onChange,
  onBlur,
  customClassNames,
}: Props) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState(initialError);

  const handleFileChange = (file: File | null) => {
    setError("");
    if (file && file.size > MAX_FILE_SIZE) {
      setError(`Dung lượng tối đa của file là ${MAX_FILE_SIZE_MB}MB`);
      onChange?.(null);
    } else {
      onChange?.(file);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleClick = () => hiddenFileInput.current?.click();

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFileChange(null);
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = "";
    }
  };

  return (
    <>
      <div
        className={classNames(
          "flex flex-wrap sm:flex-nowrap w-full items-start mt-2 sm:mt-5",
          customClassNames
        )}
      >
        <div className="w-1/4">
          <label
            htmlFor="file_input"
            className="text-SubheadSm text-primary-950"
          >
            {title}
          </label>
          <span className="text-red-500 ml-1">*</span>
        </div>
        {/* File Upload Box */}
        <div className="w-full">
          <div
            className="py-4 px-2 text-center text-bodyLg flex flex-col items-center gap-3 justify-center relative border border-gray-200 bg-gray-50 rounded-xl w-full cursor-pointer"
            onClick={handleClick}
          >
            {value ? (
              <FileInfo file={value} onRemove={handleRemoveFile} />
            ) : (
              <UploadPrompt />
            )}
            <input
              type="file"
              name="file_input"
              className="outline-none w-full grow bg-transparent opacity-0 hidden"
              accept=".zip"
              ref={hiddenFileInput}
              onChange={handleOnChange}
              onBlur={onBlur}
            />
          </div>
          {error && (
            <p className="mt-2 self-start text-sm text-red-600">{error}</p>
          )}
          {/* <div className="text-red-600 text-[14px] mt-2">
            Dung lượng tối đa của file là {MAX_FILE_SIZE_MB} MB
          </div> */}
        </div>
      </div>
      {/* Display any error message */}
    </>
  );
};

const FileInfo = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: (e: React.MouseEvent) => void;
}) => (
  <div className="flex items-center gap-2">
    <p>{file.name}</p>
    <button
      onClick={onRemove}
      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
    >
      <X size={16} />
    </button>
  </div>
);

const UploadPrompt = () => (
  <>
    <p className="text-[14px]">
      Tải lên hồ sơ dự án với định dạng .zip theo yêu cầu (Hồ sơ không quá{" "}
      {MAX_FILE_SIZE_MB} MB)
    </p>
    {/* <p className="text-gray-500">hoặc</p> */}
    <Button
      className="rounded-[4rem] px-6 font-sans"
      outlined={false}
      style={{
        borderRadius: "4rem",
      }}
    >
      Lựa chọn file
    </Button>
  </>
);
