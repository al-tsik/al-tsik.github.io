import { create } from 'zustand'

type SelectionState = {
  /** The building part the visitor clicked, or null for the overview. */
  selectedPartId: string | null
  /** The part under the pointer (or keyboard focus), for hover feedback. */
  hoveredPartId: string | null

  select: (partId: string | null) => void
  /** Selects the part, or deselects it if it's already selected. */
  toggle: (partId: string) => void
  hover: (partId: string | null) => void
}

/**
 * Shared selection state between the 3D viewer, the CV and the details
 * panel. Components subscribe to just the field they need, e.g.
 * `useSelectionStore((s) => s.selectedPartId)`, so hover changes only
 * re-render components that care about hover.
 */
export const useSelectionStore = create<SelectionState>()((set) => ({
  selectedPartId: null,
  hoveredPartId: null,

  select: (partId) => set({ selectedPartId: partId }),
  toggle: (partId) =>
    set((state) => ({ selectedPartId: state.selectedPartId === partId ? null : partId })),
  hover: (partId) => set({ hoveredPartId: partId }),
}))
