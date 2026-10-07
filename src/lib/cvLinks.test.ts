import { describe, expect, it } from 'vitest'
import type { Experience } from '../content/schema'
import { isBulletLinked, isExperienceLinked } from './cvLinks'

const job: Experience = {
  id: 'studio',
  role: 'Designer',
  company: 'Studio',
  location: 'City',
  start: '2023-01',
  end: 'present',
  descriptor: '',
  bullets: [
    { text: 'Roof and facade details', partIds: ['roof', 'facade'], figures: [], children: [] },
    { text: 'Coordination meetings', partIds: [], figures: [], children: [] },
  ],
}

describe('isBulletLinked', () => {
  it('matches any of the bullet part ids', () => {
    expect(isBulletLinked(job.bullets[0], 'facade')).toBe(true)
    expect(isBulletLinked(job.bullets[0], 'core')).toBe(false)
  })

  it('is false when nothing is selected', () => {
    expect(isBulletLinked(job.bullets[0], null)).toBe(false)
  })
})

describe('isExperienceLinked', () => {
  it('is true if any bullet links to the part', () => {
    expect(isExperienceLinked(job, 'roof')).toBe(true)
    expect(isExperienceLinked(job, 'foundation')).toBe(false)
    expect(isExperienceLinked(job, null)).toBe(false)
  })
})
