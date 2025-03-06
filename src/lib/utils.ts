import { PostVerificationType } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ConvertoStatusPostToText = (value: string) => {
  switch (value) {
    case PostVerificationType.PENDING:
      return 'Đợi duyệt'
    case PostVerificationType.DENIED:
      return 'Từ chối'
    case PostVerificationType.PENDING:
      return 'Đã duyệt'
  }
}

