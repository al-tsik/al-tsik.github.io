import type { ReactNode } from 'react'
import { regionTransform, type Region } from '../../lib/region'

type ZoomRegionProps = {
  /** Area to zoom into, in % of the content; none shows everything. */
  region?: Region
  children: ReactNode
}

/** Zooms its content to a region with a smooth (motion-safe) transition. */
export function ZoomRegion({ region, children }: ZoomRegionProps) {
  return (
    <div className="overflow-hidden">
      <div
        className="origin-center motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-in-out"
        style={{ transform: regionTransform(region) }}
      >
        {children}
      </div>
    </div>
  )
}
