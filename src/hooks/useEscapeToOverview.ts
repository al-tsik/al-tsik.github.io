import { useEffect } from 'react'
import { useSelectionStore } from '../state/selectionStore'

/** Pressing Escape anywhere returns to the overview by clearing the bullet focus. */
export function useEscapeToOverview() {
  const focusBullet = useSelectionStore((state) => state.focusBullet)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      // Let an open modal (the figure overlay) handle Escape on its own.
      if (document.querySelector('dialog:modal')) return
      focusBullet(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [focusBullet])
}
