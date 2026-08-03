import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard shadcn helper: merges conditional class strings and then resolves
 * conflicting Tailwind utilities (`twMerge`) so a caller's override always
 * wins over a component's default rather than both landing in the class list.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
