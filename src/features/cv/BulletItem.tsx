import type { Bullet } from '../../content/schema'

type BulletItemProps = {
  bullet: Bullet
  /** Related to the current selection: marked and accented. */
  isLinked: boolean
}

/** One CV bullet with its sub-bullets drawn as an indented tree. */
export function BulletItem({ bullet, isLinked }: BulletItemProps) {
  return (
    <li data-linked={isLinked}>
      <div className="flex gap-3">
        <span aria-hidden="true" className={isLinked ? 'text-accent' : 'text-ink-faint'}>
          —
        </span>
        {isLinked ? (
          <mark className="bg-accent-soft text-ink">{bullet.text}</mark>
        ) : (
          <span>{bullet.text}</span>
        )}
      </div>

      {bullet.children.length > 0 && (
        // Tree connectors: a vertical rule with a short tick into each child.
        <ul className="mt-1 ml-1.5 border-l border-line">
          {bullet.children.map((child) => (
            <li
              key={child.id ?? child.text}
              className="relative py-0.5 pl-6 text-[0.95em] before:absolute before:top-[0.85em] before:left-0 before:w-4 before:border-t before:border-line"
            >
              {child.text}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
