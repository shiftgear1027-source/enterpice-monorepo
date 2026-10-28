export type ClassValue = string | false | null | undefined;

/** Minimal class-name joiner (avoids an extra dependency). */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
