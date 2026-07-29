import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Resolve a public/ asset path against the deploy base (subpath-safe, e.g. GitHub Pages). */
export function asset(path: string) {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
