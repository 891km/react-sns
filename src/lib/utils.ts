import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// clsx: 조건부 class 조합
// twMerge: tailwind class 충돌 자동 정리
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
