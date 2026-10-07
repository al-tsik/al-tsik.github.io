import type { PointerEvent, ReactNode } from 'react'
import type { Bullet } from '../../content/schema'
import { subBulletKey } from '../../lib/figureVisibility'
import { endPreview, previewLine } from '../../state/hoverIntent'
import { FigureRefText } from './FigureRefText'

type BulletItemProps = {
  bullet: Bullet
  bulletKey: string
  /** The focused bullet or sub-bullet key, if any. */
  focusedKey: string | null
  /** Fig. number of each line's own figure, by line key. */
  lineNumbers: ReadonlyMap<string, number>
  /** Fig. numbers by figure id, for cross-references in the text. */
  numbers: ReadonlyMap<string, number>
  onFocus: (key: string) => void
  /** Figures shown inline under this bullet (mobile, when it holds the focus). */
  inlineFigures?: ReactNode
}

/**
 * Hovering (mouse only) or keyboard-focusing a line previews its figure; on
 * touch there is no hover, so a tap pins instead.
 */
function previewHandlers(key: string) {
  const isMouse = (event: PointerEvent) => event.pointerType === 'mouse'
  return {
    onPointerEnter: (event: PointerEvent) => isMouse(event) && previewLine(key),
    onPointerLeave: (event: PointerEvent) => isMouse(event) && endPreview(),
    onFocus: () => previewLine(key),
    onBlur: () => endPreview(0),
  }
}

const textButton =
  'cursor-pointer text-left underline decoration-transparent decoration-1 underline-offset-4 transition-colors hover:decoration-accent'

/**
 * One CV bullet with its sub-bullets. Lines that have a figure are buttons:
 * hovering previews the figure beside the line, clicking pins it.
 */
export function BulletItem({
  bullet,
  bulletKey,
  focusedKey,
  lineNumbers,
  numbers,
  onFocus,
  inlineFigures,
}: BulletItemProps) {
  const isFocused = focusedKey === bulletKey
  const subKeys = bullet.children.map((child, j) => subBulletKey(bulletKey, child, j))
  const isParentOfFocus = focusedKey !== null && subKeys.includes(focusedKey)
  const isActive = isFocused || isParentOfFocus
  const ownNumber = lineNumbers.get(bulletKey)
  const interactive = ownNumber !== undefined

  return (
    // Ids let figure markers scroll to a bullet (see followLink in App).
    <li id={`bullet-${bulletKey}`} className="scroll-mt-32">
      <div className="flex gap-2">
        <span aria-hidden="true" className={isActive ? 'text-accent' : 'text-ink-faint'}>
          •
        </span>
        {interactive ? (
          <button
            type="button"
            aria-pressed={isFocused}
            onClick={() => onFocus(bulletKey)}
            {...previewHandlers(bulletKey)}
            className={`${textButton} ${isActive ? 'bg-accent-soft text-ink' : ''}`}
          >
            <FigureRefText text={bullet.text} numbers={numbers} />
            <span className="ml-2 font-mono text-[10px] whitespace-nowrap text-ink-faint">
              Fig. {ownNumber}
            </span>
          </button>
        ) : (
          <span>
            <FigureRefText text={bullet.text} numbers={numbers} />
          </span>
        )}
      </div>

      {bullet.children.length > 0 && (
        <ul className="mt-0.5 ml-4">
          {bullet.children.map((child, j) => {
            const key = subKeys[j]
            const isSubFocused = focusedKey === key

            return (
              <li
                key={key}
                id={`bullet-${key}`}
                className="flex scroll-mt-32 gap-2 py-0.5 text-[0.95em]"
              >
                <span
                  aria-hidden="true"
                  className={isSubFocused ? 'text-accent' : 'text-ink-faint'}
                >
                  ◦
                </span>
                {interactive || lineNumbers.has(key) ? (
                  <button
                    type="button"
                    aria-pressed={isSubFocused}
                    onClick={() => onFocus(key)}
                    {...previewHandlers(key)}
                    className={`${textButton} ${isSubFocused ? 'text-accent' : ''}`}
                  >
                    <FigureRefText text={child.text} numbers={numbers} />
                  </button>
                ) : (
                  <FigureRefText text={child.text} numbers={numbers} />
                )}
              </li>
            )
          })}
        </ul>
      )}

      {inlineFigures}
    </li>
  )
}
