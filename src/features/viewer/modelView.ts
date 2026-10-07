import type { BuildingPart, Drawing } from '../../content/schema'
import type { ResolvedView } from '../../lib/figureVisibility'

/** Everything that controls what the model figure shows. */
export type ModelView = {
  /** Highlighted parts; other parts are ghosted. Empty = overview. */
  parts: string[]
  /** Drawing (from building.json) shown as a sheet on the model. */
  drawingId: string | null
  /** Camera angle around the building, degrees. */
  azimuth?: number
  /** Camera angle above the horizon, degrees. */
  elevation?: number
  /** Zoom multiplier on top of the automatic framing. */
  zoom?: number
}

export const OVERVIEW: ModelView = { parts: [], drawingId: null }

/** Converts a figure view resolved from the CV into a model view. */
export function toModelView(view: ResolvedView | undefined): ModelView {
  if (!view) return OVERVIEW
  return {
    parts: view.parts ?? [],
    drawingId: view.drawing ?? null,
    azimuth: view.azimuth,
    elevation: view.elevation,
    zoom: view.zoom,
  }
}

/** True when the view asks for nothing in particular, so the model may idle-orbit. */
export function isOverview(view: ModelView): boolean {
  return (
    view.parts.length === 0 &&
    view.drawingId === null &&
    view.azimuth === undefined &&
    view.elevation === undefined &&
    view.zoom === undefined
  )
}

/** Finds a drawing by id among all parts' drawings. */
export function findDrawing(parts: readonly BuildingPart[], id: string | null): Drawing | null {
  if (!id) return null
  for (const part of parts) {
    const drawing = part.drawings.find((candidate) => candidate.id === id)
    if (drawing) return drawing
  }
  return null
}
