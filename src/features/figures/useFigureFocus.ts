import { useMemo, useState } from 'react'
import {
  figureForLine,
  focusForLines,
  pickRandomLines,
  type BulletEntry,
  type FigureFocus,
} from '../../lib/figureVisibility'
import { useSelectionStore } from '../../state/selectionStore'

/**
 * What the figure column shows: the focused line's figure, or the figures of
 * a few random lines that are re-picked on every page load.
 */
export function useFigureFocus(
  bulletIndex: ReadonlyMap<string, BulletEntry>,
  figureTypes: ReadonlyMap<string, string>,
): FigureFocus {
  const focusedKey = useSelectionStore((state) => state.focusedBulletKey)
  const [randomKeys] = useState(() => pickRandomLines(bulletIndex, figureTypes, Math.random))

  return useMemo(() => {
    const keys = focusedKey ? [focusedKey] : randomKeys
    const lines = keys.flatMap((key) => {
      const entry = bulletIndex.get(key)
      const line = entry && figureForLine(entry)
      return line ? [line] : []
    })
    return focusForLines(lines)
  }, [focusedKey, randomKeys, bulletIndex])
}
