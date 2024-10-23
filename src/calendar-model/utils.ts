/** @fileoverview Contains generic helper functions (not related to hebcal or leining types) */

export function toISODateString(date: Date) {
  const minutesOffset = date.getTimezoneOffset()
  const millisecondsOffset = minutesOffset * 60 * 1000
  const local = new Date(+date - millisecondsOffset)
  return local.toISOString().substring(0, 10)
}
export function fromISODateString(str: string) {
  const date = new Date(str)
  const minutesOffset = date.getTimezoneOffset()
  const millisecondsOffset = minutesOffset * 60 * 1000
  return new Date(+date + millisecondsOffset)
}

export function last<T>(array: T[]) {
  return array[array.length - 1]
}

export function invert<K extends string, V extends string>(
  obj: Record<K, V>
): Record<V, K> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]))
}

export function range(first: number, last: number) {
  return Array.from({ length: last - first + 1 }, (_, i) => first + i)
}

export function isArrayOf<T>(
  array: unknown[],
  check: (v: unknown) => v is T
): array is T[] {
  return Array.isArray(array) && array.every(check)
}
