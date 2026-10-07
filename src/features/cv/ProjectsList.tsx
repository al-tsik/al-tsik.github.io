import type { Project } from '../../content/schema'
import { CvSection } from './CvSection'

type ProjectsListProps = {
  projects: Project[]
}

/** Personal projects, set like the printed CV: "• Title: text". */
export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <CvSection id="projects">
      <ul className="space-y-1.5 text-body">
        {projects.map((project) => (
          <li key={project.title} id={project.id} className="flex gap-2">
            <span aria-hidden="true" className="text-ink-faint">
              •
            </span>
            <span>
              <span className="font-bold">{project.title}:</span> {project.text}
            </span>
          </li>
        ))}
      </ul>
    </CvSection>
  )
}
