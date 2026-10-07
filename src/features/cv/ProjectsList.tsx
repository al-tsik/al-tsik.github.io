import type { Project } from '../../content/schema'

type ProjectsListProps = {
  projects: Project[]
}

/** Personal projects, set like the printed CV: "• Title: text". */
export function ProjectsList({ projects }: ProjectsListProps) {
  return (
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
  )
}
