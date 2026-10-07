import { beforeEach, describe, expect, it } from 'vitest'
import { useSelectionStore } from './selectionStore'

const initialState = useSelectionStore.getState()

describe('selectionStore', () => {
  beforeEach(() => {
    useSelectionStore.setState(initialState, true)
  })

  it('starts with nothing selected or hovered', () => {
    const { selectedPartId, hoveredPartId } = useSelectionStore.getState()
    expect(selectedPartId).toBeNull()
    expect(hoveredPartId).toBeNull()
  })

  it('selects and clears a part', () => {
    useSelectionStore.getState().select('roof')
    expect(useSelectionStore.getState().selectedPartId).toBe('roof')

    useSelectionStore.getState().select(null)
    expect(useSelectionStore.getState().selectedPartId).toBeNull()
  })

  it('toggle selects, switches, and deselects', () => {
    const { toggle } = useSelectionStore.getState()

    toggle('roof')
    expect(useSelectionStore.getState().selectedPartId).toBe('roof')

    toggle('core')
    expect(useSelectionStore.getState().selectedPartId).toBe('core')

    toggle('core')
    expect(useSelectionStore.getState().selectedPartId).toBeNull()
  })

  it('tracks hover independently of selection', () => {
    useSelectionStore.getState().select('roof')
    useSelectionStore.getState().hover('facade')

    expect(useSelectionStore.getState()).toMatchObject({
      selectedPartId: 'roof',
      hoveredPartId: 'facade',
    })
  })
})
