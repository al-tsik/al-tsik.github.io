/** A rectangle in percent of a figure: [x, y, width, height]. */
export type Region = readonly [number, number, number, number]

/**
 * CSS transform that zooms an element (with transform-origin at its centre)
 * so `region` fills it: translate the region's centre to the middle, then
 * scale up until the region's larger side fits. No region = identity.
 */
export function regionTransform(region: Region | undefined): string {
  if (!region) return 'none'

  const [x, y, width, height] = region
  const scale = Math.min(100 / Math.max(width, 1), 100 / Math.max(height, 1))
  const dx = 50 - (x + width / 2)
  const dy = 50 - (y + height / 2)

  return `scale(${round(scale)}) translate(${round(dx)}%, ${round(dy)}%)`
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000
}
