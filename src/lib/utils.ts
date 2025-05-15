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
    case PostVerificationType.ACCEPTED:
      return 'Đã duyệt'
  }
}

export const appendFormData = (formData: FormData, data: any, parentKey = "") => {
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "" || value instanceof File) return // Skip empty values
    const newKey = parentKey ? `${parentKey}[${key}]` : key
    if (typeof value === "object" && !(value instanceof File || value instanceof Blob)) {
      appendFormData(formData, value, newKey) // Recursively append nested objects
    } else {
      formData.append(newKey, String(value))
    }
  })
}
