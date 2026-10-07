import { describe, expect, it } from 'vitest'
import type { Cv } from '../../content/schema'
import { cvSections } from './cvSections'

const emptyCv: Cv = {
  experience: [],
  projects: [],
  education: [],
  skills: [],
  certifications: [],
  languages: [],
}

describe('cvSections', () => {
  it('leaves out sections without entries and numbers the rest from 1', () => {
    const cv: Cv = {
      ...emptyCv,
      skills: [{ group: 'Languages', items: ['C#'] }],
      languages: [{ name: 'English', level: 'Fluent' }],
    }

    expect(cvSections(cv).map(({ id, number }) => [id, number])).toEqual([
      ['skills', 1],
      ['languages', 2],
    ])
  })

  it('returns nothing for an empty CV', () => {
    expect(cvSections(emptyCv)).toEqual([])
  })
})
