import type { ReactNode } from 'react'
import type { BuildingPart } from '../../content/schema'
import { useSelectionStore } from '../../state/selectionStore'
import { DrawingList } from './DrawingList'
import { DynamoScriptCard } from './DynamoScriptCard'
import { ImageGallery } from './ImageGallery'

type PartDetailsPanelProps = {
  parts: BuildingPart[]
}

/** Details for the selected building part, shown below the 3D viewer. */
export function PartDetailsPanel({ parts }: PartDetailsPanelProps) {
  const selectedPartId = useSelectionStore((state) => state.selectedPartId)
  const select = useSelectionStore((state) => state.select)
  const part = parts.find((candidate) => candidate.id === selectedPartId)

  if (!part) return null

  const headingId = `part-${part.id}-heading`

  return (
    <aside
      // Re-mount per part so the entrance animation replays on each selection.
      key={part.id}
      aria-labelledby={headingId}
      className="m-4 flex flex-col border border-line bg-paper motion-safe:animate-panel-in lg:mx-0"
    >
      <header className="flex items-start gap-3 border-b border-line p-4">
        <span
          aria-hidden="true"
          className="grid size-7 shrink-0 place-items-center rounded-full bg-accent font-mono text-xs text-white"
        >
          {part.number}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] tracking-widest text-ink-muted uppercase">
            Part {String(part.number).padStart(2, '0')}
          </p>
          <h2 id={headingId} className="text-lg leading-tight font-semibold tracking-tight">
            {part.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => select(null)}
          aria-label="Close details"
          className="-m-1 cursor-pointer p-1 text-xl leading-none text-ink-muted hover:text-accent"
        >
          ×
        </button>
      </header>

      <div className="space-y-6 p-4">
        <p className="text-sm leading-relaxed">{part.summary}</p>

        {part.drawings.length > 0 && (
          <PanelSection title="Drawings">
            <DrawingList drawings={part.drawings} />
          </PanelSection>
        )}

        {part.dynamoScripts.length > 0 && (
          <PanelSection title="Dynamo scripts">
            <div className="space-y-3">
              {part.dynamoScripts.map((script) => (
                <DynamoScriptCard key={script.id} script={script} />
              ))}
            </div>
          </PanelSection>
        )}

        {part.images.length > 0 && (
          <PanelSection title="Details">
            <ImageGallery images={part.images} />
          </PanelSection>
        )}
      </div>
    </aside>
  )
}

function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 font-mono text-[10px] tracking-widest text-ink-muted uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}
