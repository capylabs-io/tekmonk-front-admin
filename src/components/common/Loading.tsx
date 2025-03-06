"use client";

import React from "react";

import { useLoadingStore } from "@/store/LoadingStore";

export function Loading() {
  const [isShowing, content] = useLoadingStore((state) => [
    state.isShowing,
    state.content,
  ]);

  return isShowing ? (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/70 text-6xl">
      <div className="flex flex-col items-center">
        <span
          className="inline-block h-14 w-14 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white/80"
          role="status"
          aria-label="loading"
        />
        {content && (
          <div className="text-white/80 mt-4 text-base font-medium">
            {content}
          </div>
        )}
      </div>
    </div>
  ) : null;
}

type LoadingProps = {
  height?: string;
  width?: string;
  color?: string;
};

export const DefaultLoading: React.FC<LoadingProps> = ({
  width = "16px",
  height = "16px",
  color = "white",
}) => (
  <span
    className="animate-spin rounded-full border-[3px] border-current border-t-transparent"
    style={{ width: width, height: height, color: color }}
    role="status"
    aria-label="loading"
  />
);
