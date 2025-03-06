"use client";
import classNames from "classnames";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import React, { useEffect } from "react";

import { SnackbarTypes, useSnackbarStore } from "@/store/SnackbarStore";

const BASE_CLASSES =
  "inset-x-0 mx-auto w-fit rounded-md p-4 hs-removing:translate-x-10 hs-removing:opacity-0 fixed z-[99] transition-all duration-1000 ease-in-out";

export const Snackbar: React.FC = () => {
  const [isShowing, message, title, type, isLastMessage, close] =
    useSnackbarStore((state) => [
      state.isShowing,
      state.message,
      state.title,
      state.type,
      state.isLastMessage,
      state.close,
    ]);
  useEffect(() => {
    const interval = setInterval(close, isLastMessage ? 15000 : 10000);
    return () => clearInterval(interval);
  }, [isLastMessage, close]);

  const SNACKBAR_ICON = (type: SnackbarTypes) => {
    switch (type) {
      case SnackbarTypes.error:
        return <XCircle color="white" size={20} />;
      case SnackbarTypes.success:
        return <CheckCircle2 className="white" size={20} />;
      case SnackbarTypes.info:
        return <AlertCircle color="white" size={20} />;
      case SnackbarTypes.warning:
        return <AlertTriangle color="white" size={20} />;
      default:
        return <AlertCircle color="white" size={20} />;
    }
  };

  const SNACKBAR_COLOR = (type: SnackbarTypes) => {
    switch (type) {
      case SnackbarTypes.error:
        return "bg-red-600 border text-sm text-white";
      case SnackbarTypes.success:
        return "bg-primary-600 border text-sm text-white";
      case SnackbarTypes.info:
        return "bg-blue-600 border text-sm text-white";
      case SnackbarTypes.warning:
        return "bg-yellow-600 border text-sm text-white";
      default:
        return "bg-blue-600 border text-sm text-white";
    }
  };

  const ICON = SNACKBAR_ICON(type);
  const snackClass = SNACKBAR_COLOR(type);
  return (
    <div
      className={classNames(
        BASE_CLASSES,
        isShowing ? "top-5" : "-top-[400px]",
        snackClass
      )}
    >
      <div className="flex w-full">
        <div className="shrink-0">{ICON}</div>
        <div className="-mt-1 ml-3">
          <div className="text-base font-semibold">{title}</div>
          <div>{message}</div>
        </div>
        <div className="ml-3">
          <div className="-mt-1">
            <button
              type="button"
              onClick={close}
              className="inline-flex cursor-pointer rounded-md"
            >
              <X color="white" size={16} className="mt-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
