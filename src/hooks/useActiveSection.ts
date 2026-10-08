import { useEffect, useState } from 'react'
import { pickActiveSection } from '../lib/activeSection'

/** Fraction of the viewport height used as the "reading line". */
const READING_LINE = 0.3

/** Keys that scroll the page, ending a pinned (clicked) entry. */
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])

/**
 * Scroll-spy: returns the id of the section currently being read, measured
 * on scroll/resize (throttled to one measurement per frame).
 *
 * `pin(id)` marks an entry the reader jumped to as active until they scroll
 * themselves: a jump can't always bring a short section to the reading line
 * (e.g. near the end of the page), where measuring would pick a neighbour.
 */
export function useActiveSection(ids: readonly string[]) {
  const [measuredId, setMeasuredId] = useState<string | null>(null)
  const [pinnedId, setPinnedId] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const positions = ids.flatMap((id) => {
        const element = document.getElementById(id)
        return element ? [{ id, top: element.getBoundingClientRect().top }] : []
      })
      const scrollBottom = window.scrollY + window.innerHeight
      const atPageEnd = scrollBottom >= document.documentElement.scrollHeight - 2
      setMeasuredId(pickActiveSection(positions, window.innerHeight * READING_LINE, atPageEnd))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [ids])

  // Any scrolling of the reader's own ends the pin. A click on another entry
  // releases on pointerdown, then pins the new one on click.
  useEffect(() => {
    if (!pinnedId) return
    const release = () => setPinnedId(null)
    const onKey = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) release()
    }

    window.addEventListener('wheel', release, { passive: true })
    window.addEventListener('touchstart', release, { passive: true })
    window.addEventListener('pointerdown', release)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', release)
      window.removeEventListener('touchstart', release)
      window.removeEventListener('pointerdown', release)
      window.removeEventListener('keydown', onKey)
    }
  }, [pinnedId])

  const activeId = pinnedId && ids.includes(pinnedId) ? pinnedId : measuredId
  return { activeId, pin: setPinnedId }
}
