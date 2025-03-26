"use client";
import classNames from "classnames";
import React, { ReactNode, useEffect, useState } from "react";
import { ImgSubmitPreview } from "@/components/contest/ImgSubmitPreview";

type Props = {
  value: File | null;
  contentImageUpload: ReactNode
  customInputClassNames?: string;
  customClassNames?: string;
  error?: string;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
};
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/svg+xml"];
const BASE_CLASS =
  "w-full rounded-xl border border-grey-300 bg-grey-50 p-3 h-[140px] flex flex-col items-center justify-center relative text-sm";
export const InputFileUpdload = ({
  value,
  error,
  onChange,
  onBlur,
  customInputClassNames,
  contentImageUpload,
  customClassNames,
}: Props) => {
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(value);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isExceedFileSize, setIsExceedFileSize] = useState(false);

  const MAX_IMAGE_SIZE = parseInt(
    process.env.NEXT_PUBLIC_MAX_SIZE_IMAGE_UPLOAD || "15"
  );
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      if (selectedFile.size > MAX_IMAGE_SIZE * 1024 * 1024) {
        setIsExceedFileSize(true);
        return;
      }
      setFile(selectedFile);
      console.log('selectedFile', selectedFile);

      onChange?.(selectedFile);
    }
  };
  const handleOnBlur = () => {
    onBlur && onBlur();
  };
  const handleClick = () => {
    hiddenFileInput.current!.click();
  };
  const removeImg = () => {
    setFile(null);
    onChange?.(null);
  };

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);
  return (
    <>
      <div
        className={classNames(
          "flex w-full items-center text-base font-bold gap-x-4",
          customClassNames
        )}
      >

        <div
          className={classNames(
            BASE_CLASS,
            customInputClassNames
            // error &&
            // "border-red-500 focus:border-red-500 text-sm focus:border-2",
            // value &&
            // !error &&
            // "border-green-400 focus:border-green-400 focus:border-2"
          )}
        >
          {file && fileUrl ?
            <ImgSubmitPreview
              src={fileUrl}
              key={file.name}
              width={150}
              height={100}
              className="mr-2"
              onRemove={removeImg}
            /> :
            <>
              <input
                type="file"
                className="outline-none w-full grow bg-transparent opacity-0"
                accept={ALLOWED_FILE_TYPES.join(", ")}
                ref={hiddenFileInput}
                onChange={handleOnChange}
                onBlur={handleOnBlur}
              />

              <div
                className="absolute text-gray-400 text-center font-normal"
                onClick={handleClick}
              >
                {
                  contentImageUpload
                }
              </div>
            </>
          }
        </div>
      </div>
      {isExceedFileSize && (
        <>
          <p className="mt-2 self-start text-sm text-red-600 ">
            Ảnh không quá {MAX_IMAGE_SIZE} MB
          </p>
        </>
      )}
      {/* {error && <p className="mt-2 self-start text-sm text-red-600">{error}</p>} */}
    </>
  );
};
