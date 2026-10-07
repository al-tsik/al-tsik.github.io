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

  it('toggles the active drawing', () => {
    const { toggleDrawing } = useSelectionStore.getState()

    toggleDrawing('section-a-a')
    expect(useSelectionStore.getState().activeDrawingId).toBe('section-a-a')

    toggleDrawing('plan-level-02')
    expect(useSelectionStore.getState().activeDrawingId).toBe('plan-level-02')

    toggleDrawing('plan-level-02')
    expect(useSelectionStore.getState().activeDrawingId).toBeNull()
  })

  it('hides the drawing when the selected part changes', () => {
    useSelectionStore.getState().select('floors')
    useSelectionStore.getState().toggleDrawing('section-a-a')

    useSelectionStore.getState().select('roof')
    expect(useSelectionStore.getState().activeDrawingId).toBeNull()
  })

  it('keeps the drawing when the same part is selected again', () => {
    useSelectionStore.getState().select('floors')
    useSelectionStore.getState().toggleDrawing('section-a-a')

    useSelectionStore.getState().select('floors') // e.g. restored from the URL
    expect(useSelectionStore.getState().activeDrawingId).toBe('section-a-a')
  })

  it('tracks the focused bullet and the open figure independently', () => {
    useSelectionStore.getState().focusBullet('roof-facade-details')
    useSelectionStore.getState().openFigure('section-a-a')

    expect(useSelectionStore.getState()).toMatchObject({
      focusedBulletKey: 'roof-facade-details',
      openFigureId: 'section-a-a',
    })

    useSelectionStore.getState().openFigure(null)
    expect(useSelectionStore.getState().focusedBulletKey).toBe('roof-facade-details')
  })
})
