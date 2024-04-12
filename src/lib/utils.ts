import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isISODate(date: string) {
  return moment(date, moment.ISO_8601, true).isValid();
}

export function formatISODate(date: string) {
  return date.split("T", 1)[0].replaceAll("-", "/");
}
