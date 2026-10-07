import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { createStore, type StoreApi } from 'zustand/vanilla'
import { OVERVIEW, type ModelView } from './modelView'

export type ModelViewState = {
  view: ModelView
  /** Hover is local to each viewer, so a thumbnail and the overlay don't interfere. */
  hoveredPartId: string | null
  /** Called when a part (mesh or label) is clicked; absent = parts aren't clickable. */
  onPartClick?: (partId: string) => void
  /** Show the numbered part labels. */
  showLabels: boolean
  setHoveredPartId: (partId: string | null) => void
}

/**
 * One small store per BuildingViewer, shared with its meshes and labels via
 * context. A store (rather than a plain context value) lets each mesh
 * subscribe to just its own hover/selection state, which matters for real
 * exports with thousands of meshes.
 */
export function createModelViewStore(
  initial: Partial<Pick<ModelViewState, 'view' | 'onPartClick' | 'showLabels'>> = {},
): StoreApi<ModelViewState> {
  return createStore<ModelViewState>()((set) => ({
    view: OVERVIEW,
    hoveredPartId: null,
    onPartClick: undefined,
    showLabels: true,
    ...initial,
    setHoveredPartId: (partId) => set({ hoveredPartId: partId }),
  }))
}

export const ModelViewContext = createContext<StoreApi<ModelViewState> | null>(null)

/** Reads per-viewer state; use inside a BuildingViewer. */
export function useModelView<T>(selector: (state: ModelViewState) => T): T {
  const store = useContext(ModelViewContext)
  if (!store) throw new Error('useModelView must be used inside a BuildingViewer')
  return useStore(store, selector)
}
