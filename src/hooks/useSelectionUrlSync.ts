import { useEffect } from 'react'
import { readPartFromSearch, writePartToSearch } from '../lib/partUrl'
import { useSelectionStore } from '../state/selectionStore'

/**
 * Keeps `?part=<id>` in the address bar in sync with the selected part, so a
 * selection can be shared as a link. Uses replaceState so clicking around
 * the model doesn't fill the browser's back history.
 */
export function useSelectionUrlSync(validIds: readonly string[]) {
  const selectedPartId = useSelectionStore((state) => state.selectedPartId)
  const select = useSelectionStore((state) => state.select)

  // Restore the selection from the URL on first load.
  useEffect(() => {
    const initial = readPartFromSearch(window.location.search, validIds)
    if (initial) select(initial)
  }, [validIds, select])

  // Reflect later selections in the URL.
  useEffect(() => {
    const search = writePartToSearch(window.location.search, selectedPartId)
    const url = `${window.location.pathname}${search}${window.location.hash}`
    window.history.replaceState(window.history.state, '', url)
  }, [selectedPartId])
}
