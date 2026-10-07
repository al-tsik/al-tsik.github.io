import { useLayoutEffect, useState, type RefObject } from 'react'
import { layoutMargin } from '../../lib/marginLayout'

export type MarginLayout = { tops: number[]; height: number }

/** Gap between stacked margin figures, in px. */
const GAP = 24

/**
 * Measures where each anchor line (`bullet-<key>`) sits relative to the
 * margin container and how tall each figure is, then lays the figures out
 * beside their lines without overlapping. Re-measures when anything that
 * affects the positions resizes (text reflow, images loading, fonts).
 * Returns the tops and the total height needed, or null until measured.
 */
export function useMarginTops(
  anchorKeys: readonly string[],
  containerRef: RefObject<HTMLElement | null>,
  itemRefs: RefObject<Map<string, HTMLElement>>,
  itemKeys: readonly string[],
): MarginLayout | null {
  const [layout, setLayout] = useState<MarginLayout | null>(null)
  // Joined keys stand in for the arrays, so equal contents don't re-run the effect.
  const anchorsKey = anchorKeys.join('|')
  const itemsKey = itemKeys.join('|')

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    const anchors = anchorsKey ? anchorsKey.split('|') : []
    const ids = itemsKey ? itemsKey.split('|') : []

    let frame = 0
    const measure = () => {
      frame = 0
      const containerTop = container.getBoundingClientRect().top
      const items = anchors.map((key, i) => {
        const anchor = document.getElementById(`bullet-${key}`)
        const item = itemRefs.current.get(ids[i])
        return {
          anchorTop: anchor ? anchor.getBoundingClientRect().top - containerTop : 0,
          height: item?.offsetHeight ?? 0,
        }
      })
      const tops = layoutMargin(items, GAP)
      const height = Math.max(0, ...tops.map((top, i) => top + items[i].height))
      setLayout((prev) =>
        prev &&
        prev.height === height &&
        prev.tops.length === tops.length &&
        prev.tops.every((top, i) => top === tops[i])
          ? prev
          : { tops, height },
      )
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    const observer = new ResizeObserver(schedule)
    const cv = document.getElementById('cv')
    if (cv) observer.observe(cv)
    itemRefs.current.forEach((item) => observer.observe(item))
    window.addEventListener('resize', schedule)
    void document.fonts.ready.then(schedule)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', schedule)
    }
  }, [anchorsKey, itemsKey, containerRef, itemRefs])

  return layout
}
