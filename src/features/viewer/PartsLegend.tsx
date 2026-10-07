import type { BuildingPart } from '../../content/schema'
import { useSelectionStore } from '../../state/selectionStore'

type PartsLegendProps = {
  parts: BuildingPart[]
}

/**
 * The drawing key: a numbered list of parts overlaid on the viewer. It is
 * also the keyboard and screen-reader alternative to clicking the model.
 * z-[11] keeps it above drei <Html> labels, which use z-index 0-10.
 */
export function PartsLegend({ parts }: PartsLegendProps) {
  const selectedPartId = useSelectionStore((state) => state.selectedPartId)
  const hoveredPartId = useSelectionStore((state) => state.hoveredPartId)
  const toggle = useSelectionStore((state) => state.toggle)
  const hover = useSelectionStore((state) => state.hover)

  return (
    <nav
      aria-label="Building parts"
      className="absolute bottom-4 left-4 z-[11] border border-line bg-paper/90 p-3 backdrop-blur"
    >
      <p className="mb-2 font-mono text-[10px] tracking-widest text-ink-muted uppercase">Key</p>
      <ol className="space-y-0.5">
        {parts.map((part) => {
          const isSelected = selectedPartId === part.id
          const isActive = isSelected || hoveredPartId === part.id

          return (
            <li key={part.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggle(part.id)}
                onPointerEnter={() => hover(part.id)}
                onPointerLeave={() => hover(null)}
                onFocus={() => hover(part.id)}
                onBlur={() => hover(null)}
                className={`flex w-full cursor-pointer items-center gap-2 py-0.5 text-left text-xs ${
                  isActive ? 'text-accent' : 'text-ink'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid size-4 place-items-center rounded-full border font-mono text-[9px] ${
                    isActive ? 'border-accent bg-accent text-white' : 'border-ink'
                  }`}
                >
                  {part.number}
                </span>
                {part.name}
              </button>
            </li>
          )
        })}
      </ol>
      {selectedPartId && (
        <p className="mt-2 font-mono text-[10px] text-ink-faint">Esc to reset view</p>
      )}
    </nav>
  )
}
