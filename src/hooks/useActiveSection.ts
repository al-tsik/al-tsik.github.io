import { useEffect, useState } from 'react'
import { pickActiveSection } from '../lib/activeSection'

/** Fraction of the viewport height used as the "reading line". */
const READING_LINE = 0.3

/**
 * Scroll-spy: returns the id of the section currently being read.
 * Measures on scroll/resize (throttled to one measurement per frame).
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

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
      setActiveId(pickActiveSection(positions, window.innerHeight * READING_LINE, atPageEnd))
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

  return activeId
}
