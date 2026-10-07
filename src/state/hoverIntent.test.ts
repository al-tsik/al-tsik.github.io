import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  endPreview,
  holdPreview,
  PREVIEW_GRACE_MS,
  previewLine,
  SCROLL_SETTLE_MS,
  suppressPreviewsWhileScrolling,
} from './hoverIntent'
import { useSelectionStore } from './selectionStore'

const hovered = () => useSelectionStore.getState().hoveredLineKey

describe('hoverIntent', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useSelectionStore.setState({ hoveredLineKey: null })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('previews a line immediately', () => {
    previewLine('roof')
    expect(hovered()).toBe('roof')
  })

  it('keeps the preview during the grace period, then clears it', () => {
    previewLine('roof')
    endPreview()
    vi.advanceTimersByTime(PREVIEW_GRACE_MS - 1)
    expect(hovered()).toBe('roof')
    vi.advanceTimersByTime(1)
    expect(hovered()).toBeNull()
  })

  it('holds the preview while the pointer is on the figure', () => {
    previewLine('roof')
    endPreview()
    holdPreview()
    vi.advanceTimersByTime(PREVIEW_GRACE_MS * 4)
    expect(hovered()).toBe('roof')
  })

  it('switches straight to another line without a gap', () => {
    previewLine('roof')
    endPreview()
    previewLine('facade')
    vi.advanceTimersByTime(PREVIEW_GRACE_MS * 2)
    expect(hovered()).toBe('facade')
  })

  it('ignores lines that slide under the pointer while scrolling to a pin', () => {
    previewLine('roof')
    suppressPreviewsWhileScrolling()
    expect(hovered()).toBeNull()

    previewLine('facade')
    expect(hovered()).toBeNull()

    vi.advanceTimersByTime(SCROLL_SETTLE_MS)
    previewLine('facade')
    expect(hovered()).toBe('facade')
  })
})
