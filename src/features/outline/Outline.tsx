import type { Experience } from '../../content/schema'
import { useActiveSection } from '../../hooks/useActiveSection'
import { cvSections } from '../cv/cvSections'

// Module-level so the array identity is stable for the scroll-spy effect.
const sectionIds = cvSections.map((section) => section.id)

type OutlineProps = {
  /** Roles listed under "Experience" as second-level entries. */
  experience: Experience[]
}

/** Table of contents with the section being read highlighted (scroll-spy). */
export function Outline({ experience }: OutlineProps) {
  const activeId = useActiveSection(sectionIds)

  return (
    <nav aria-label="Contents" className="font-sans text-sm">
      <p className="mb-3 font-mono text-[10px] tracking-widest text-ink-muted uppercase">
        Contents
      </p>
      <ol className="space-y-1.5">
        {cvSections.map((section, index) => {
          const isActive = section.id === activeId

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={`flex gap-2 transition-colors hover:text-accent ${
                  isActive ? 'text-ink' : 'text-ink-faint'
                }`}
              >
                <span aria-hidden="true" className={isActive ? 'text-accent' : ''}>
                  {isActive ? '▸' : ' '}
                </span>
                <span className="font-mono text-xs">{index + 1}</span>
                {section.title}
              </a>

              {section.id === 'experience' && (
                <ol className="mt-1 ml-[2.1rem] space-y-1 text-xs">
                  {experience.map((job) => (
                    <li key={job.id}>
                      <a
                        href={`#experience-${job.id}`}
                        className="text-ink-faint transition-colors hover:text-accent"
                      >
                        {job.company}
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
