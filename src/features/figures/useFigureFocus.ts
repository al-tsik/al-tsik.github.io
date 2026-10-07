import { useMemo, useState } from 'react'
import type { Figure } from '../../content/schema'
import {
  focusForBullet,
  pickInitialFigures,
  type BulletEntry,
  type FigureFocus,
} from '../../lib/figureVisibility'
import { useSelectionStore } from '../../state/selectionStore'

/**
 * What the figure column shows: the focused bullet's figures and views, or
 * a random selection (model + others) that is re-picked on every page load.
 */
export function useFigureFocus(
  figures: readonly Figure[],
  bulletIndex: ReadonlyMap<string, BulletEntry>,
  modelFigureId: string | null,
): FigureFocus {
  const focusedKey = useSelectionStore((state) => state.focusedBulletKey)
  const [initialFigureIds] = useState(() => pickInitialFigures(figures, Math.random))

  return useMemo(() => {
    const entry = focusedKey ? bulletIndex.get(focusedKey) : undefined
    return entry ? focusForBullet(entry, modelFigureId) : { figureIds: initialFigureIds, views: {} }
  }, [focusedKey, bulletIndex, modelFigureId, initialFigureIds])
}
