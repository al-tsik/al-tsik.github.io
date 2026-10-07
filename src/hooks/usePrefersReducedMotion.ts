import { useMediaQuery } from './useMediaQuery'

/**
 * True when the visitor's OS asks for less motion. Animations that aren't
 * essential (auto-rotation, camera fly-throughs) should respect it.
 * Updates live if the setting changes while the page is open.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
