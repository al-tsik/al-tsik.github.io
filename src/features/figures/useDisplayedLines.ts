import { useMemo, useState } from 'react'
import {
  figureForLine,
  pickRandomLines,
  type BulletEntry,
  type LineFigure,
} from '../../lib/figureVisibility'
import { useSelectionStore } from '../../state/selectionStore'

/**
 * The line figures on screen: the focused line's figure, or the figures of a
 * few random lines that are re-picked on every page load.
 */
export function useDisplayedLines(
  bulletIndex: ReadonlyMap<string, BulletEntry>,
  figureTypes: ReadonlyMap<string, string>,
): LineFigure[] {
  const focusedKey = useSelectionStore((state) => state.focusedBulletKey)
  const [randomKeys] = useState(() => pickRandomLines(bulletIndex, figureTypes, Math.random))

  return useMemo(() => {
    const keys = focusedKey ? [focusedKey] : randomKeys
    return keys.flatMap((key) => {
      const entry = bulletIndex.get(key)
      const line = entry && figureForLine(entry)
      return line ? [line] : []
    })
  }, [focusedKey, randomKeys, bulletIndex])
}
