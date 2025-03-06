import React from "react";
import { X } from "lucide-react";

type ImgSubmitPreviewProps = {
  src: string;
  width: number;
  height: number;
  className?: string;
  onRemove: () => void;
};

export const ImgSubmitPreview: React.FC<ImgSubmitPreviewProps> = ({
  src,
  width,
  height,
  className,
  onRemove,
}) => {
  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        width={width}
        height={height}
        alt="Preview Image"
        className="object-cover rounded-lg"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
        aria-label="Remove image"
      >
        <X size={16} />
      </button>
    </div>
  );
};
