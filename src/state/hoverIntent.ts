import { useSelectionStore } from './selectionStore'

/** How long a preview survives after the pointer leaves its line, in ms. */
export const PREVIEW_GRACE_MS = 250

let timer: ReturnType<typeof setTimeout> | undefined

/** Shows the figure of the hovered (or keyboard-focused) line. */
export function previewLine(key: string) {
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
