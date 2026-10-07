import { useSelectionStore } from './selectionStore'

/** How long a preview survives after the pointer leaves its line, in ms. */
export const PREVIEW_GRACE_MS = 250

/** How long to ignore previews while the page scrolls after a pin, in ms. */
export const SCROLL_SETTLE_MS = 900

let timer: ReturnType<typeof setTimeout> | undefined
let suppressedUntil = 0

/** Shows the figure of the hovered (or keyboard-focused) line. */
export function previewLine(key: string) {
  // Lines sliding under a still pointer while the page scrolls aren't hovers.
  if (Date.now() < suppressedUntil) return
  clearTimeout(timer)
  useSelectionStore.getState().hoverLine(key)
}

/**
 * Ends the preview after a grace period, so the pointer can travel from the
 * line to its figure without the figure disappearing.
 */
export function endPreview(delay = PREVIEW_GRACE_MS) {
  clearTimeout(timer)
  timer = setTimeout(() => useSelectionStore.getState().hoverLine(null), delay)
}

/** Keeps the current preview (e.g. while the pointer is over the figure). */
export function holdPreview() {
  clearTimeout(timer)
}

/**
 * Clears any preview and ignores new ones while the page scrolls to a pinned
 * line, so the pinned figure isn't replaced by whatever ends up under the
 * pointer.
 */
export function suppressPreviewsWhileScrolling() {
  clearTimeout(timer)
  suppressedUntil = Date.now() + SCROLL_SETTLE_MS
  useSelectionStore.getState().hoverLine(null)
}
