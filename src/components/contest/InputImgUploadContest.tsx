"use client";
import { ImgSubmitPreview } from "@/components/contest/ImgSubmitPreview";
import classNames from "classnames";
import { ImagePlus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  title: string;
  value: File | null;
  customClassNames?: string;
  error?: string;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
};

const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/svg+xml"];

export const InputImgUploadContest = ({
  title,
  value,
  error,
  onChange,
  onBlur,
  customClassNames,
}: Props) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(value);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isExceedFileSize, setIsExceedFileSize] = useState(false);
  const MAX_IMAGE_SIZE = parseInt(
    process.env.NEXT_PUBLIC_MAX_SIZE_IMAGE_UPLOAD || "15"
  );
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      if (selectedFile.size > MAX_IMAGE_SIZE * 1024 * 1024) {
        setIsExceedFileSize(true);
        return;
      }
      setFile(selectedFile);
      onChange?.(selectedFile);
    }
  };

  const removeImg = () => {
    setFile(null);
    onChange?.(null);
  };

  const handleClick = () => hiddenFileInput.current?.click();

  return (
    <>
      <div
        className={classNames(
          "flex flex-wrap w-full items-start sm:mb-5",
          customClassNames,
          isExceedFileSize && "!mb-10"
        )}
      >
        <div className="w-full sm:w-1/5 mb-1">
          <label
            htmlFor="file_input"
            className="text-SubheadSm text-primary-950"
          >
            {title}
          </label>
          <p className="text-bodySm text-gray-500">SVG, PNG, JPG</p>
        </div>

        <div className="flex items-center flex-wrap h-16 space-y-2">
          {file && fileUrl ? (
            <ImgSubmitPreview
              src={fileUrl}
              key={file.name}
              width={64}
              height={64}
              className="mr-2"
              onRemove={removeImg}
            />
          ) : (
            <div>
              <div
                className="rounded-lg p-8 flex items-center justify-center relative bg-gray-00 border cursor-pointer"
                onClick={handleClick}
              >
                <ImagePlus size={24} className="absolute text-gray-500" />
                <input
                  type="file"
                  name="file_input"
                  className="hidden"
                  ref={hiddenFileInput}
                  accept={ALLOWED_FILE_TYPES.join(", ")}
                  onChange={handleFileChange}
                  onBlur={onBlur}
                />
              </div>
              {isExceedFileSize && (
                <>
                  <p className="mt-2 self-start text-sm text-red-600 ">
                    Ảnh không quá {MAX_IMAGE_SIZE} MB
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {error && <p className="mt-2 self-start text-sm text-red-600">{error}</p>}
    </>
  );
};
