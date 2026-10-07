import { useState } from 'react'
import type { DynamoScript } from '../../content/schema'
import type { Region } from '../../lib/region'
import { CodePreview } from './CodePreview'
import { ZoomRegion } from './ZoomRegion'

type DynamoFigureProps = {
  script: DynamoScript
  /** Zoom the graph screenshot to a region. */
  region?: Region
  /** Highlight Python lines; also opens the code preview. */
  lines?: readonly [number, number]
}

/** A Dynamo graph screenshot with its description and Python source. */
export function DynamoFigure({ script, region, lines }: DynamoFigureProps) {
  const [isCodeOpen, setIsCodeOpen] = useState(false)
  // A view that highlights lines keeps the code open.
  const showCode = isCodeOpen || lines !== undefined

  return (
    <div>
      <ZoomRegion region={region}>
        <img
          src={script.graphImage.src}
          alt={script.graphImage.alt}
          loading="lazy"
          className="block h-auto w-full"
        />
      </ZoomRegion>

      <div className="space-y-2 border-t border-line p-3">
        <p className="text-sm font-semibold tracking-tight">{script.title}</p>
        <p className="text-xs leading-relaxed text-ink-muted">{script.description}</p>

        {script.pythonFile && (
          <details open={showCode} onToggle={(event) => setIsCodeOpen(event.currentTarget.open)}>
            <summary className="cursor-pointer font-mono text-[10px] tracking-widest text-ink-muted uppercase hover:text-accent">
              Python source
            </summary>
            {/* Only fetch the file once the code is shown. */}
            <div className="mt-2">
              {showCode && <CodePreview src={script.pythonFile} highlight={lines} />}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
