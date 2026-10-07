import { describe, expect, it } from 'vitest'
import { embedUrl } from './embedUrl'

const yt = (start: number) =>
  `https://www.youtube-nocookie.com/embed/abc123?autoplay=1&start=${start}`

describe('embedUrl', () => {
  it('handles the YouTube URL formats', () => {
    expect(embedUrl('https://www.youtube.com/watch?v=abc123')).toBe(yt(0))
    expect(embedUrl('https://youtu.be/abc123')).toBe(yt(0))
    expect(embedUrl('https://www.youtube.com/embed/abc123')).toBe(yt(0))
    expect(embedUrl('https://m.youtube.com/watch?v=abc123&t=10')).toBe(yt(0))
  })

  it('starts YouTube videos at whole seconds', () => {
    expect(embedUrl('https://youtu.be/abc123', 12.8)).toBe(yt(12))
  })

  it('handles Vimeo with a start time', () => {
    expect(embedUrl('https://vimeo.com/76979871', 30)).toBe(
      'https://player.vimeo.com/video/76979871?autoplay=1#t=30s',
    )
  })

  it('returns null for unsupported or invalid URLs', () => {
    expect(embedUrl('https://example.com/video.mp4')).toBeNull()
    expect(embedUrl('not a url')).toBeNull()
  })
})
