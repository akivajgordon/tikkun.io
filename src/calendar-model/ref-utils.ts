import { physicalLocationFromRef } from '../location.ts'
import { Ref } from '../ref.ts'
import { LeiningRun, LeiningAliyah } from './model-types.ts'

/** Returns true if the next עלייה is far enough away to need a second ספר תורה. */
export function isSameRun(existing: LeiningAliyah, next: LeiningAliyah) {
  if (existing.end.b !== next.start.b) return false
  // If they're in the same פרק, they're definitely close.
  if (existing.end.c === next.start.c) return true

  const existingLocation = physicalLocationFromRef(existing.end)
  const nextLocation = physicalLocationFromRef(next.start)

  return Math.abs(nextLocation.pageNumber - existingLocation.pageNumber) < 3
}

/** Checks whether a run or single עלייה contains a פסוק, or any פסוק in an array. */
export function containsRef(
  o: LeiningAliyah | LeiningRun,
  ref: Ref | Ref[]
): boolean {
  if (Array.isArray(ref)) return ref.some((r) => containsRef(o, r))
  if (isRun(o)) return o.aliyot.some((a) => containsRef(a, ref))
  return compareRefs(o.start, ref) <= 0 && compareRefs(o.end, ref) >= 0
}

export function compareRefs(a: Ref, b: Ref): -1 | 0 | 1 {
  if (a.b != b.b) return compare(a.b, b.b)
  if (a.c != b.c) return compare(a.c, b.c)
  return compare(a.v, b.v)
}

function compare(a: number, b: number): -1 | 0 | 1 {
  if (a === b) return 0
  return a < b ? -1 : 1
}

function isRun(o: object): o is LeiningRun {
  return 'aliyot' in o
}
