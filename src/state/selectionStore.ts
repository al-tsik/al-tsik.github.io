import { create } from 'zustand'

type SelectionState = {
  /** The CV bullet or sub-bullet whose figures are shown (see lib/figureVisibility). */
  focusedBulletKey: string | null
  /** The figure popped out in the overlay, if any. */
  openFigureId: string | null
  /** The line being hovered (or keyboard-focused), previewing its figure. */
  hoveredLineKey: string | null

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
  focusedBulletKey: null,
  openFigureId: null,
  hoveredLineKey: null,

  focusBullet: (key) => set({ focusedBulletKey: key }),
  openFigure: (figureId) => set({ openFigureId: figureId }),
  hoverLine: (key) => set({ hoveredLineKey: key }),
}))
