import { useEffect } from 'react'
import { useSelectionStore } from '../state/selectionStore'

/** Pressing Escape anywhere returns to the overview: clears the bullet focus and part selection. */
export function useEscapeToDeselect() {
  const select = useSelectionStore((state) => state.select)
  const focusBullet = useSelectionStore((state) => state.focusBullet)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      // Let an open modal (e.g. the lightbox) handle Escape on its own.
      if (document.querySelector('dialog:modal')) return
      select(null)
      focusBullet(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [select, focusBullet])
}
