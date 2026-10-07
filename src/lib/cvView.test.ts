import { describe, expect, it } from 'vitest'
import type { Cv, Profile } from '../content/schema'
import { filterCv, isCvView, profileFor } from './cvView'

const cv: Cv = {
  experience: [
    {
      id: 'studio',
      role: 'Developer',
      company: 'Studio',
      start: '2024',
      end: 'present',
      bullets: [
        { text: 'Built the platform.', for: ['developer'], children: [] },
        { text: 'Ran BIM training.', for: ['architect'], children: [] },
        { text: 'Led workshops.', children: [] },
      ],
    },
    {
      id: 'office',
      role: 'Architectural Assistant',
      company: 'Office',
      start: '2018',
      end: '2021',
      for: ['architect'],
      bullets: [{ text: 'Drew details.', children: [] }],
    },
    {
      id: 'games',
      role: 'Freelance',
      company: 'Games',
      start: '2019',
      end: 'present',
      bullets: [{ id: 'vr', text: 'Built a VR demo.', for: ['developer'], children: [] }],
    },
  ],
  projects: [
    { title: 'Home lab', text: 'Docker.', for: ['developer'] },
    { title: 'Sketchbook', text: 'Drawings.' },
  ],
  education: [],
  skills: [
    { group: 'Languages', items: ['C#'], for: ['developer'] },
    { group: 'AEC', items: ['Revit'], for: ['architect'] },
  ],
  certifications: [],
  languages: [],
}

const texts = (view: Parameters<typeof filterCv>[1]) =>
  filterCv(cv, view).experience.map((job) => [job.id, job.bullets.map((b) => b.text)])

describe('filterCv', () => {
  it('shows everything in the "both" view', () => {
    expect(filterCv(cv, 'both').experience).toHaveLength(3)
    expect(filterCv(cv, 'both').skills).toHaveLength(2)
  })

  it('leaves out roles, bullets, skills and projects tagged for the other view', () => {
    expect(texts('developer')).toEqual([
      ['studio', ['Built the platform.', 'Led workshops.']],
      ['games', ['Built a VR demo.']],
    ])
    expect(filterCv(cv, 'developer').skills.map((g) => g.group)).toEqual(['Languages'])
    expect(filterCv(cv, 'architect').projects.map((p) => p.title)).toEqual(['Sketchbook'])
  })

  it('leaves out a role whose bullets are all hidden', () => {
    expect(texts('architect')).toEqual([
      ['studio', ['Ran BIM training.', 'Led workshops.']],
      ['office', ['Drew details.']],
    ])
  })

  it('keeps bullet keys from the full CV, so links work in every view', () => {
    const ids = (view: Parameters<typeof filterCv>[1]) =>
      filterCv(cv, view).experience.flatMap((job) => job.bullets.map((b) => b.id))
    expect(ids('both')).toEqual(['studio-1', 'studio-2', 'studio-3', 'office-1', 'vr'])
    expect(ids('architect')).toEqual(['studio-2', 'studio-3', 'office-1'])
  })
})

describe('profileFor', () => {
  const profile: Profile = {
    name: 'Jo',
    role: 'Software Developer',
    summary: 'Builds software.',
    contact: [],
    views: { architect: { role: 'Architectural Designer' } },
  }

  it("uses a view's own role and falls back for the rest", () => {
    expect(profileFor(profile, 'architect')).toMatchObject({
      role: 'Architectural Designer',
      summary: 'Builds software.',
    })
    expect(profileFor(profile, 'developer').role).toBe('Software Developer')
    expect(profileFor(profile, 'both').role).toBe('Software Developer')
  })
})

describe('isCvView', () => {
  it('accepts the three views only', () => {
    expect(['both', 'developer', 'architect', 'manager'].map(isCvView)).toEqual([
      true,
      true,
      true,
      false,
    ])
  })
})
