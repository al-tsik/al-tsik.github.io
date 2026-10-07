import { useEffect } from 'react'
import { scrollToLine } from '../features/cv/scrollToLine'
import type { CvView } from '../lib/cvView'
import { readUrlState, writeUrlState } from '../lib/urlState'
import { useSelectionStore } from '../state/selectionStore'

/**
 * Keeps `?cv=<view>&b=<bullet>&fig=<figure>` in the address bar in sync with
 * the CV view, the focused bullet and the open figure, so any state can be shared as a link.
 * Uses replaceState so exploring doesn't fill the browser's back history.
 */
export function useUrlStateSync(
  isBullet: (key: string, view: CvView) => boolean,
  isFigure: (id: string) => boolean,
) {
  const cvView = useSelectionStore((state) => state.cvView)
  const setCvView = useSelectionStore((state) => state.setCvView)
  const focusedKey = useSelectionStore((state) => state.focusedBulletKey)
  const openFigureId = useSelectionStore((state) => state.openFigureId)
  const focusBullet = useSelectionStore((state) => state.focusBullet)
  const openFigure = useSelectionStore((state) => state.openFigure)

  // Restore the state from the URL on first load, bringing the bullet into view.
  useEffect(() => {
    const { view, bullet, figure } = readUrlState(window.location.search, isBullet, isFigure)
    if (view !== 'both') setCvView(view)
    if (bullet) {
      focusBullet(bullet)
      requestAnimationFrame(() => scrollToLine(bullet))
    }
    if (figure) openFigure(figure)
  }, [isBullet, isFigure, setCvView, focusBullet, openFigure])

  // Reflect later changes in the URL.
  useEffect(() => {
    const search = writeUrlState(window.location.search, {
      view: cvView,
      bullet: focusedKey,
      figure: openFigureId,
    })
    const url = `${window.location.pathname}${search}${window.location.hash}`
    window.history.replaceState(window.history.state, '', url)
  }, [cvView, focusedKey, openFigureId])
}
