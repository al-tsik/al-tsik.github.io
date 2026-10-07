import { Html } from '@react-three/drei'
import { Vector3 } from 'three'
import type { BuildingPart } from '../../content/schema'
import type { ModelBounds } from './bounds'
import { useModelView } from './ModelViewContext'

type PartLabelProps = {
  part: BuildingPart
  position: Vector3
}

function PartLabel({ part, position }: PartLabelProps) {
  const onPartClick = useModelView((state) => state.onPartClick)
  const setHoveredPartId = useModelView((state) => state.setHoveredPartId)
  const isSelected = useModelView((state) => state.view.parts.includes(part.id))
  const isHovered = useModelView((state) => state.hoveredPartId === part.id)
  const isActive = isSelected || isHovered

  const className = `grid size-6 place-items-center rounded-full border text-[11px] transition-colors ${
    isActive ? 'border-accent bg-accent text-white' : 'border-ink bg-paper text-ink'
  }`

  return (
    // zIndexRange keeps labels below the sticky site header.
    <Html position={position} center zIndexRange={[10, 0]}>
      {onPartClick ? (
        <button
          type="button"
          aria-label={`${part.number}. ${part.name}`}
          aria-pressed={isSelected}
          title={`${part.name} — ${part.summary}`}
          // Stop the event reaching the canvas, which would treat it as a
          // click on empty space or on the mesh behind the label.
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation()
            onPartClick(part.id)
          }}
          onPointerEnter={() => setHoveredPartId(part.id)}
          onPointerLeave={() => setHoveredPartId(null)}
          onFocus={() => setHoveredPartId(part.id)}
          onBlur={() => setHoveredPartId(null)}
          className={`${className} cursor-pointer hover:border-accent`}
        >
          {part.number}
        </button>
      ) : (
        <span aria-hidden="true" className={className}>
          {part.number}
        </span>
      )}
    </Html>
  )
}

type PartLabelsProps = {
  parts: BuildingPart[]
  bounds: ModelBounds
}

/** Numbered markers anchored to each building part (clickable when the viewer allows). */
export function PartLabels({ parts, bounds }: PartLabelsProps) {
  const showLabels = useModelView((state) => state.showLabels)
  if (!showLabels) return null

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
