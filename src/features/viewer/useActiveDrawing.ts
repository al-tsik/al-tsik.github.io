import type { BuildingPart, Drawing } from '../../content/schema'
import { useSelectionStore } from '../../state/selectionStore'

/** The drawing toggled on in the details panel, from the selected part. */
export function useActiveDrawing(parts: BuildingPart[]): Drawing | null {
  const selectedPartId = useSelectionStore((state) => state.selectedPartId)
  const activeDrawingId = useSelectionStore((state) => state.activeDrawingId)

  const part = parts.find((candidate) => candidate.id === selectedPartId)
  return part?.drawings.find((drawing) => drawing.id === activeDrawingId) ?? null
}
