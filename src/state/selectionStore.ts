import { create } from 'zustand'
import type { CvView } from '../lib/cvView'

type SelectionState = {
  /** How the CV is read: developer, architect, or both. */
  cvView: CvView
  /** The CV bullet or sub-bullet whose figures are shown (see lib/figureVisibility). */
  focusedBulletKey: string | null
  /** The figure popped out in the overlay, if any. */
  openFigureId: string | null
  /** The line being hovered (or keyboard-focused), previewing its figure. */
  hoveredLineKey: string | null

  setCvView: (view: CvView) => void
  focusBullet: (key: string | null) => void
  openFigure: (figureId: string | null) => void
  hoverLine: (key: string | null) => void
}

/**
 * Page-level interaction state shared by the CV, the figure column and the
 * overlay. Everything the figures show is derived from it (and the content);
 * each 3D viewer keeps its own hover state locally.
 */
export const useSelectionStore = create<SelectionState>()((set) => ({
  cvView: 'both',
  focusedBulletKey: null,
  openFigureId: null,
  hoveredLineKey: null,

  setCvView: (view) => set({ cvView: view }),
  focusBullet: (key) => set({ focusedBulletKey: key }),
  openFigure: (figureId) => set({ openFigureId: figureId }),
  hoverLine: (key) => set({ hoveredLineKey: key }),
}))
