import type { Drawing } from '../../content/schema'
import { useSelectionStore } from '../../state/selectionStore'

type DrawingListProps = {
  drawings: Drawing[]
}

/** Toggle buttons that place a drawing on the 3D model. */
export function DrawingList({ drawings }: DrawingListProps) {
  const activeDrawingId = useSelectionStore((state) => state.activeDrawingId)
  const toggleDrawing = useSelectionStore((state) => state.toggleDrawing)

  return (
    <ul className="space-y-1">
      {drawings.map((drawing) => {
        const isActive = activeDrawingId === drawing.id

        return (
          <li key={drawing.id}>
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => toggleDrawing(drawing.id)}
              className={`flex w-full cursor-pointer items-center justify-between border px-3 py-2 text-left text-sm transition-colors ${
                isActive
                  ? 'border-accent bg-accent-soft'
                  : 'border-line bg-surface hover:border-ink'
              }`}
            >
              <span>
                {drawing.title}
                <span className="ml-2 font-mono text-[10px] text-ink-muted uppercase">
                  {drawing.kind}
                </span>
              </span>
              <span className="font-mono text-[10px] text-ink-muted uppercase">
                {isActive ? 'Hide' : 'Show on model'}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
