export type SectionPosition = {
  id: string
  /** Distance from the top of the viewport to the section's top edge, in px. */
  top: number
}

/**
 * The section being read: the last one (in document order) whose top has
 * scrolled past `line` px from the top of the viewport. Before the first
 * section reaches the line, nothing is active. At the end of the page the
 * last section wins, since short final sections may never reach the line.
 */
export function pickActiveSection(
  sections: readonly SectionPosition[],
  line: number,
  atPageEnd = false,
): string | null {
  if (atPageEnd && sections.length > 0) return sections[sections.length - 1].id

  let active: string | null = null
  for (const section of sections) {
    if (section.top <= line) active = section.id
  }
  return active
}
