export const PAPER = { r: 255, g: 255, b: 255 }
export const SIGNAL = { r: 0, g: 255, b: 133 }
// Palette collapsed to one green accent (July 2026). volt/pink remain as
// aliases so scenes compile; they now render green / white, never blue / pink.
export const VOLT = { r: 0, g: 255, b: 133 }
export const PINK = { r: 255, g: 255, b: 255 }

export const paper = (a: number) => `rgba(${PAPER.r},${PAPER.g},${PAPER.b},${a})`
export const signal = (a: number) => `rgba(${SIGNAL.r},${SIGNAL.g},${SIGNAL.b},${a})`
export const volt = (a: number) => `rgba(${VOLT.r},${VOLT.g},${VOLT.b},${a})`
export const pink = (a: number) => `rgba(${PINK.r},${PINK.g},${PINK.b},${a})`

/** Grid gap that keeps particle counts sane across screen sizes. */
export function adaptiveGap(w: number, h: number, density: 'dense' | 'medium' | 'sparse'): number {
  const dim = Math.min(w, h)
  const base = density === 'dense' ? dim / 220 : density === 'medium' ? dim / 130 : dim / 60
  return Math.max(2, Math.round(base))
}

export const isCoarsePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
