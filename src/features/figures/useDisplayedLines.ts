import { useMemo, useState } from 'react'
import {
  displayedLineKeys,
  figureForLine,
  pickRandomLines,
  type BulletEntry,
  type LineFigure,
} from '../../lib/figureVisibility'
import { useSelectionStore } from '../../state/selectionStore'

/**
 * The line figures on screen: a hovered line's preview, else the pinned
 * (focused) line, else a few random lines re-picked on every page load and
 * whenever the lines change (e.g. switching the CV view).
 */
export function useDisplayedLines(
  bulletIndex: ReadonlyMap<string, BulletEntry>,
  figureTypes: ReadonlyMap<string, string>,
): LineFigure[] {
  const focusedKey = useSelectionStore((state) => state.focusedBulletKey)
  const hoveredKey = useSelectionStore((state) => state.hoveredLineKey)
  const [random, setRandom] = useState(() => ({
    index: bulletIndex,
    keys: pickRandomLines(bulletIndex, figureTypes, Math.random),
  }))
  // Adjusting state during render (not in an effect) avoids a frame of stale figures.
  if (random.index !== bulletIndex) {
    setRandom({ index: bulletIndex, keys: pickRandomLines(bulletIndex, figureTypes, Math.random) })
  }
  const randomKeys = random.keys

  return useMemo(() => {
    return displayedLineKeys(hoveredKey, focusedKey, randomKeys).flatMap((key) => {
      const entry = bulletIndex.get(key)
      const line = entry && figureForLine(entry)
      return line ? [line] : []
    })
  }, [hoveredKey, focusedKey, randomKeys, bulletIndex])
}
