import { useMemo } from 'react'
import type { Experience } from '../../content/schema'
import { useActiveSection } from '../../hooks/useActiveSection'
import type { CvSectionInfo } from '../cv/cvSections'

type OutlineProps = {
  sections: CvSectionInfo[]
  /** Roles listed under "Experience" as second-level entries. */
  experience: Experience[]
}

const roleAnchor = (job: Experience) => `experience-${job.id}`

/** Table of contents with the section and role being read highlighted (scroll-spy). */
export function Outline({ sections, experience }: OutlineProps) {
  // Every anchor in document order: the roles sit inside the experience
  // section. Memoised so the array identity is stable for the scroll-spy effect.
  const anchorIds = useMemo(
    () =>
      sections.flatMap((section) =>
        section.id === 'experience' ? [section.id, ...experience.map(roleAnchor)] : [section.id],
      ),
    [sections, experience],
  )
  const { activeId, pin } = useActiveSection(anchorIds)
  const activeRole = experience.find((job) => roleAnchor(job) === activeId)
  const activeSectionId = activeRole ? 'experience' : activeId

  return (
    <nav aria-label="Contents" className="font-sans text-sm">
      <p className="mb-3 text-[10px] tracking-widest text-ink-muted uppercase">Contents</p>
      <ol className="space-y-1.5">
        {sections.map((section) => {
          const isActive = section.id === activeSectionId

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={() => pin(section.id)}
                // The role, when one is active, is the more precise "you are here".
                aria-current={isActive && !activeRole ? 'location' : undefined}
                className={`flex gap-2 transition-colors hover:text-accent ${
                  isActive ? 'text-ink' : 'text-ink-faint'
                }`}
              >
                {/* Fixed-width columns, so the numbers line up whether or not the marker shows. */}
                <span aria-hidden="true" className="w-3 shrink-0 text-center text-accent">
                  {isActive ? '▸' : ''}
                </span>
                <span className="w-3 shrink-0 text-xs tabular-nums">{section.number}</span>
                {section.title}
              </a>

              {section.id === 'experience' && (
                <ol className="mt-1 ml-10 space-y-1 text-xs">
                  {experience.map((job) => (
                    <li key={job.id}>
                      <a
                        href={`#${roleAnchor(job)}`}
                        onClick={() => pin(roleAnchor(job))}
                        aria-current={job === activeRole ? 'location' : undefined}
                        className={`transition-colors hover:text-accent ${
                          job === activeRole ? 'text-ink' : 'text-ink-faint'
                        }`}
                      >
                        {/* The start year tells apart two roles at the same company. */}
                        {job.company} · {job.start.slice(0, 4)}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
