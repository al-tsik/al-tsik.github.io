import { Html } from '@react-three/drei'
import { Vector3 } from 'three'
import type { BuildingPart } from '../../content/schema'
import { useSelectionStore } from '../../state/selectionStore'
import type { ModelBounds } from './bounds'

type PartLabelProps = {
  part: BuildingPart
  position: Vector3
}

function PartLabel({ part, position }: PartLabelProps) {
  const toggle = useSelectionStore((state) => state.toggle)
  const hover = useSelectionStore((state) => state.hover)
  const isSelected = useSelectionStore((state) => state.selectedPartId === part.id)
  const isHovered = useSelectionStore((state) => state.hoveredPartId === part.id)
  const isActive = isSelected || isHovered

  return (
    // zIndexRange keeps labels below the sticky site header.
    <Html position={position} center zIndexRange={[10, 0]}>
      <button
        type="button"
        aria-label={`${part.number}. ${part.name}`}
        aria-pressed={isSelected}
        title={part.name}
        // Stop the event reaching the canvas, which would treat it as a
        // click on empty space (deselect) or on the mesh behind the label.
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation()
          toggle(part.id)
        }}
        onPointerEnter={() => hover(part.id)}
        onPointerLeave={() => hover(null)}
        onFocus={() => hover(part.id)}
        onBlur={() => hover(null)}
        className={`grid size-6 cursor-pointer place-items-center rounded-full border font-mono text-[11px] transition-colors ${
          isActive
            ? 'border-accent bg-accent text-white'
            : 'border-ink bg-paper text-ink hover:border-accent'
        }`}
      >
        {part.number}
      </button>
    </Html>
  )
}

type PartLabelsProps = {
  parts: BuildingPart[]
  bounds: ModelBounds
}

/** Numbered, clickable markers anchored to each building part. */
export function PartLabels({ parts, bounds }: PartLabelsProps) {
  return (
    <>
      {parts.map((part) => {
        const box = bounds.parts.get(part.id)
        if (!box) return null // part has no meshes in this model

        const position = part.labelPosition
          ? new Vector3(...part.labelPosition)
          : box.getCenter(new Vector3())

        return <PartLabel key={part.id} part={part} position={position} />
      })}
    </>
  )
}
