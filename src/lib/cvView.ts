import type { Audience, Cv, Profile } from '../content/schema'
import { bulletKey } from './figureVisibility'

/** How the CV is read: as a developer's, an architect's, or the full CV. */
export type CvView = Audience | 'both'

export const cvViews: readonly CvView[] = ['both', 'developer', 'architect']

export function isCvView(value: string): value is CvView {
  return (cvViews as readonly string[]).includes(value)
}

/** Whether an entry tagged `for` shows in a view (untagged entries always do). */
export function showsIn(view: CvView, entry: { for?: Audience[] }): boolean {
  return view === 'both' || !entry.for || entry.for.includes(view)
}

/**
 * The CV as read in one view: roles, bullets, skill groups and projects not
 * tagged for it are left out, and so is a role whose bullets all are.
 *
 * Bullets without an id get their position in the full CV as one, so a
 * bullet's key (and any `?b=` link to it) is the same in every view.
 */
export function filterCv(cv: Cv, view: CvView): Cv {
  const experience = cv.experience.flatMap((job) => {
    if (!showsIn(view, job)) return []
    const bullets = job.bullets
      .map((bullet, i) => ({ ...bullet, id: bulletKey(job.id, bullet, i) }))
      .filter((bullet) => showsIn(view, bullet))
    return bullets.length > 0 || job.bullets.length === 0 ? [{ ...job, bullets }] : []
  })

  return {
    ...cv,
    experience,
    skills: cv.skills.filter((group) => showsIn(view, group)),
    projects: cv.projects.filter((project) => showsIn(view, project)),
  }
}

/** The profile with the view's own role and summary, where it has them. */
export function profileFor(profile: Profile, view: CvView): Profile {
  const overrides = view === 'both' ? undefined : profile.views?.[view]
  return {
    ...profile,
    role: overrides?.role ?? profile.role,
    summary: overrides?.summary ?? profile.summary,
  }
}
