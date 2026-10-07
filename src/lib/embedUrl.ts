/**
 * Converts a YouTube or Vimeo page URL into an autoplaying embed URL that
 * starts at `startSeconds`. YouTube uses the privacy-enhanced
 * youtube-nocookie.com domain. Returns null for unsupported URLs.
 */
export function embedUrl(url: string, startSeconds = 0): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const host = parsed.hostname.replace(/^www\./, '')
  const start = Math.max(0, Math.floor(startSeconds))

  const youtubeId =
    host === 'youtu.be'
      ? parsed.pathname.slice(1)
      : host === 'youtube.com' || host === 'm.youtube.com'
        ? (parsed.searchParams.get('v') ??
          parsed.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)/)?.[1])
        : undefined
  if (youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&start=${start}`
  }

  const vimeoId = host === 'vimeo.com' ? parsed.pathname.match(/^\/(\d+)/)?.[1] : undefined
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}?autoplay=1#t=${start}s`
  }

  return null
}
