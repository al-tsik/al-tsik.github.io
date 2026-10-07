import type { Bullet } from '../../content/schema'
import { subBulletKey } from '../../lib/figureVisibility'

type BulletItemProps = {
  bullet: Bullet
  bulletKey: string
  /** The focused bullet or sub-bullet key, if any. */
  focusedKey: string | null
  /** Fig. numbers this bullet shows; empty = nothing to show, not clickable. */
  figureNumbers: number[]
  onFocus: (key: string) => void
}

const textButton =
  'cursor-pointer text-left underline decoration-transparent decoration-1 underline-offset-4 transition-colors hover:decoration-accent'

/**
 * One CV bullet with its sub-bullets drawn as an indented tree. Bullets that
 * have figures are buttons: clicking one shows its figures; sub-bullets
 * change how those figures are shown.
 */
export function BulletItem({
  bullet,
  bulletKey,
  focusedKey,
  figureNumbers,
  onFocus,
}: BulletItemProps) {
  const isFocused = focusedKey === bulletKey
  const subKeys = bullet.children.map((child, j) => subBulletKey(bulletKey, child, j))
  const isParentOfFocus = focusedKey !== null && subKeys.includes(focusedKey)
  const isActive = isFocused || isParentOfFocus
  const interactive = figureNumbers.length > 0

  return (
    <li>
      <div className="flex gap-3">
        <span aria-hidden="true" className={isActive ? 'text-accent' : 'text-ink-faint'}>
          —
        </span>
        {interactive ? (
          <button
            type="button"
            aria-pressed={isFocused}
            onClick={() => onFocus(bulletKey)}
            className={`${textButton} ${isActive ? 'bg-accent-soft text-ink' : ''}`}
          >
            {bullet.text}
            <span className="ml-2 font-mono text-[10px] whitespace-nowrap text-ink-faint">
              Fig. {figureNumbers.join(', ')}
            </span>
          </button>
        ) : (
          <span>{bullet.text}</span>
        )}
      </div>

      {bullet.children.length > 0 && (
        // Tree connectors: a vertical rule with a short tick into each child.
        <ul className="mt-1 ml-1.5 border-l border-line">
          {bullet.children.map((child, j) => {
            const key = subKeys[j]
            const isSubFocused = focusedKey === key

            return (
              <li
                key={key}
                className={`relative py-0.5 pl-6 text-[0.95em] before:absolute before:top-[0.85em] before:left-0 before:w-4 before:border-t ${
                  isSubFocused ? 'before:border-accent' : 'before:border-line'
                }`}
              >
                {interactive || child.views.length > 0 ? (
                  <button
                    type="button"
                    aria-pressed={isSubFocused}
                    onClick={() => onFocus(key)}
                    className={`${textButton} ${isSubFocused ? 'text-accent' : ''}`}
                  >
                    {child.text}
                  </button>
                ) : (
                  child.text
                )}
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
