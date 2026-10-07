import type { Bullet, Experience } from '../content/schema'

/** True if the bullet is linked to the given building part. */
export function isBulletLinked(bullet: Bullet, partId: string | null): boolean {
  return partId !== null && bullet.partIds.includes(partId)
}

/** True if any bullet of the role is linked to the given building part. */
export function isExperienceLinked(job: Experience, partId: string | null): boolean {
  return job.bullets.some((bullet) => isBulletLinked(bullet, partId))
}
