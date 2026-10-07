import { create } from 'zustand'

type SelectionState = {
  /** The building part the visitor clicked, or null for the overview. */
  selectedPartId: string | null
  /** The part under the pointer (or keyboard focus), for hover feedback. */
  hoveredPartId: string | null
  /** The drawing shown on the model, if any. Belongs to the selected part. */
  activeDrawingId: string | null
  /** The CV bullet or sub-bullet whose figures are shown (see lib/figureVisibility). */
  focusedBulletKey: string | null
  /** The figure popped out in the overlay, if any. */
  openFigureId: string | null

  select: (partId: string | null) => void
  /** Selects the part, or deselects it if it's already selected. */
  toggle: (partId: string) => void
  hover: (partId: string | null) => void
  /** Shows the drawing on the model, or hides it if it's already shown. */
  toggleDrawing: (drawingId: string) => void
  focusBullet: (key: string | null) => void
  openFigure: (figureId: string | null) => void
}

/**
 * Shared selection state between the 3D viewer, the CV and the details
 * panel. Components subscribe to just the field they need, e.g.
 * `useSelectionStore((s) => s.selectedPartId)`, so hover changes only
 * re-render components that care about hover.
 *
 * Changing the selected part always hides the active drawing, since
 * drawings belong to a part.
 */
export const useSelectionStore = create<SelectionState>()((set) => ({
  selectedPartId: null,
  hoveredPartId: null,
  activeDrawingId: null,
  focusedBulletKey: null,
  openFigureId: null,

  select: (partId) =>
    set((state) =>
      state.selectedPartId === partId ? state : { selectedPartId: partId, activeDrawingId: null },
    ),
  toggle: (partId) =>
    set((state) => ({
      selectedPartId: state.selectedPartId === partId ? null : partId,
      activeDrawingId: null,
    })),
  hover: (partId) => set({ hoveredPartId: partId }),
  toggleDrawing: (drawingId) =>
    set((state) => ({
      activeDrawingId: state.activeDrawingId === drawingId ? null : drawingId,
    })),
  focusBullet: (key) => set({ focusedBulletKey: key }),
  openFigure: (figureId) => set({ openFigureId: figureId }),
}))
