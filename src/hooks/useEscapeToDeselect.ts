import { useEffect } from 'react'
import { useSelectionStore } from '../state/selectionStore'

/** Pressing Escape anywhere on the page returns the viewer to the overview. */
export function useEscapeToDeselect() {
  const select = useSelectionStore((state) => state.select)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      // Let an open modal (e.g. the lightbox) handle Escape on its own.
      if (document.querySelector('dialog:modal')) return
      select(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [select])
}
