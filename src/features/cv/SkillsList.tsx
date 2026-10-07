import type { SkillGroup } from '../../content/schema'

type SkillsListProps = {
  skills: SkillGroup[]
}

/** One line per group, set like the printed CV: "Label: a, b, c (note)". */
export function SkillsList({ skills }: SkillsListProps) {
  return (
    <ul className="space-y-1.5 text-body">
      {skills.map((group) => (
        <li key={group.group}>
          <span className="font-bold">{group.group}:</span> {group.items.join(', ')}
          {group.note && <span className="text-ink-muted"> ({group.note})</span>}
        </li>
      ))}
    </ul>
  )
}
