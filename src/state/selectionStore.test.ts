import { beforeEach, describe, expect, it } from 'vitest'
import { useSelectionStore } from './selectionStore'

const initialState = useSelectionStore.getState()

describe('selectionStore', () => {
  beforeEach(() => {
    useSelectionStore.setState(initialState, true)
  })

  it('starts with nothing focused or open', () => {
    expect(useSelectionStore.getState()).toMatchObject({
      focusedBulletKey: null,
      openFigureId: null,
    })
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
