import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Quita prefijos de timestamp del nombre (antes del primer '_' o '-')
export function stripTimestamp(input: string) {
  const idxUnderscore = input.indexOf('_');
  const idxDash = input.indexOf('-');
  let cutIdx = -1;
  if (idxUnderscore >= 0 && idxDash >= 0) {
    cutIdx = Math.min(idxUnderscore, idxDash);
  } else if (idxUnderscore >= 0) {
    cutIdx = idxUnderscore;
  } else if (idxDash >= 0) {
    cutIdx = idxDash;
  }
  return cutIdx >= 0 ? input.slice(cutIdx + 1) : input;
}
