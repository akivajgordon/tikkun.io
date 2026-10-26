/** A contiguous, inclusive range of columns (physical page numbers). */
export interface ColumnSelection {
  first: number
  last: number
}

/**
 * Applies a click on a column.  The selection always contains `anchor` (the
 * column the user was reading).  Clicking another column makes it the new edge
 * on its side of the anchor, whether that grows or shrinks the selection.
 * Clicking the anchor resets the selection to just that column.
 */
export function selectEdge(
  selection: ColumnSelection,
  anchor: number,
  clicked: number
): ColumnSelection {
  if (clicked < anchor) return { first: clicked, last: selection.last }
  if (clicked > anchor) return { first: selection.first, last: clicked }
  return { first: anchor, last: anchor }
}
