import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateWithSeconds(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function diffText(end: Date | string): string {
  const diff = new Date(end).getTime() - new Date().getTime();

  if (diff <= 0) {
    return 'Expired';
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const s = seconds % 60;
  const m = minutes % 60;
  const h = hours;

  let result = '';
  if (h > 0) result += `${h} h `;
  if (m > 0) result += `${m} min `;
  if (s > 0) result += `${s} s`;

  return result.trim();
}
