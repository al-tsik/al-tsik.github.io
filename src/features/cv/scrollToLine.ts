/** Where a pinned line comes to rest, as a fraction of the viewport height. */
const READING_POSITION = 1 / 3

/**
 * Scrolls a CV line (bullet or sub-bullet) to the reading position, so the
 * line and the figure beside it sit comfortably in view.
 */
export function scrollToLine(key: string) {
  const line = document.getElementById(`bullet-${key}`)
  if (!line) return

  const top =
    line.getBoundingClientRect().top + window.scrollY - window.innerHeight * READING_POSITION
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? 'auto' : 'smooth' })
}
