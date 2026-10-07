export type MarginItem = {
  /** Where the item would like to sit: its line's top, relative to the margin. */
  anchorTop: number
  height: number
}

/**
 * Sidenote-style layout: each item sits level with its line, and an item
 * that would overlap the one above is pushed down just enough to clear it
 * (plus `gap`). Returns each item's top, in the same order as `items`.
 */
export function layoutMargin(items: readonly MarginItem[], gap = 16): number[] {
  const order = items.map((_, i) => i).sort((a, b) => items[a].anchorTop - items[b].anchorTop)
  const tops = new Array<number>(items.length)

  let nextFree = 0
  for (const i of order) {
    const top = Math.max(items[i].anchorTop, nextFree, 0)
    tops[i] = top
    nextFree = top + items[i].height + gap
  }
  return tops
}
