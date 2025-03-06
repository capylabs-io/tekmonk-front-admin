import Image, { ImageProps as NextImageProps } from "next/image";
import { useState, useCallback, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

type ImageProps = Omit<NextImageProps, "src" | "alt" | "width" | "height"> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

export const ImageCustom = ({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    if (src !== imageSrc) {
      setIsLoading(true);
      setHasError(false);
      setImageSrc(src);
    }
  }, [src, imageSrc]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-md">
        <p className="text-red-500 font-semibold text-center p-4">
          <span className="block text-3xl mb-2">⚠️</span>
          Không thể tải ảnh
        </p>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <Skeleton className="w-full h-full bg-slate-100" aria-hidden="true" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </>
  );
};
