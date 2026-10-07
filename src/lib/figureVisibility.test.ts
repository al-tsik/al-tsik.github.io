import { describe, expect, it } from 'vitest'
import type { Experience, Figure } from '../content/schema'
import {
  figureForLine,
  focusForLines,
  indexBullets,
  nextFocus,
  numberFigures,
  pickRandomLines,
  resolveLink,
} from './figureVisibility'

const figure = (id: string, type: 'model' | 'image' = 'image'): Figure =>
  type === 'model'
    ? { id, type, caption: '', alt: id }
    : { id, type, src: `/${id}.svg`, caption: '', alt: id }

const figures = [figure('img-a'), figure('model', 'model'), figure('img-b'), figure('img-c')]
const figureTypes = new Map(figures.map((f) => [f.id, f.type]))

const experience: Experience[] = [
  {
    id: 'studio',
    role: 'Designer',
    company: 'Studio',
    location: 'City',
    start: '2023-01',
    end: 'present',
    descriptor: 'Overview, see {fig:img-c}.',
    bullets: [
      {
        id: 'roof',
        text: 'Roof details',
        figure: { figure: 'model', parts: ['roof', 'facade'] },
        children: [
          {
            id: 'parapet',
            text: 'Parapet',
            figure: { figure: 'model', parts: ['roof'], azimuth: 30 },
          },
          { text: 'Drainage' },
        ],
      },
      {
        id: 'detail',
        text: 'Details',
        figure: { figure: 'img-b' },
        children: [],
      },
      { text: 'Meetings', children: [] },
    ],
  },
]

const index = indexBullets(experience)

describe('indexBullets', () => {
  it('keys bullets by id, or by position when they have none', () => {
    expect([...index.keys()]).toEqual(['roof', 'parapet', 'roof-2', 'detail', 'studio-3'])
  })

  it('links sub-bullets to their parent', () => {
    expect(index.get('parapet')).toMatchObject({ parentKey: 'roof', sub: { text: 'Parapet' } })
    expect(index.get('roof')?.parentKey).toBeNull()
  })
})

describe('nextFocus', () => {
  it('focuses a newly clicked bullet', () => {
    expect(nextFocus(null, 'roof', index)).toBe('roof')
    expect(nextFocus('roof', 'parapet', index)).toBe('parapet')
  })

  it('steps a re-clicked sub-bullet back to its parent', () => {
    expect(nextFocus('parapet', 'parapet', index)).toBe('roof')
  })

  it('unfocuses a re-clicked main bullet', () => {
    expect(nextFocus('roof', 'roof', index)).toBeNull()
  })
})

describe('figureForLine', () => {
  it("returns the line's figure and view, anchored to the line", () => {
    expect(figureForLine(index.get('parapet')!)).toEqual({
      key: 'parapet',
      figureId: 'model',
      view: { figure: 'model', parts: ['roof'], azimuth: 30 },
    })
  })

  it("falls back to the parent's figure for sub-bullets without one", () => {
    expect(figureForLine(index.get('roof-2')!)).toMatchObject({
      key: 'roof-2',
      figureId: 'model',
      view: { parts: ['roof', 'facade'] },
    })
  })

  it('is null for lines without a figure', () => {
    expect(figureForLine(index.get('studio-3')!)).toBeNull()
  })
})

describe('focusForLines', () => {
  it('shows one figure per line with its view', () => {
    const focus = focusForLines([figureForLine(index.get('detail')!)!])
    expect(focus).toEqual({ figureIds: ['img-b'], views: { 'img-b': { figure: 'img-b' } } })
  })
})

describe('pickRandomLines', () => {
  it('starts with a model line and never repeats a figure', () => {
    const keys = pickRandomLines(index, figureTypes, () => 0.5)
    const figuresShown = keys.map((key) => figureForLine(index.get(key)!)!.figureId)
    expect(figuresShown[0]).toBe('model')
    expect(new Set(figuresShown).size).toBe(figuresShown.length)
  })

  it('only picks lines with their own figure', () => {
    expect(pickRandomLines(index, figureTypes, () => 0.1)).not.toContain('roof-2')
  })

  it('varies with the random source', () => {
    const picks = new Set(
      [0, 0.3, 0.6, 0.9].map((r) => pickRandomLines(index, figureTypes, () => r)[0]),
    )
    expect(picks.size).toBeGreaterThan(1)
  })
})

describe('numberFigures', () => {
  it('numbers figures by first mention, then the rest in file order', () => {
    const numbers = numberFigures(figures, experience)
    expect(Object.fromEntries(numbers)).toEqual({ 'img-c': 1, model: 2, 'img-b': 3, 'img-a': 4 })
  })
})

describe('resolveLink', () => {
  it('links to a bullet or sub-bullet by id', () => {
    expect(resolveLink({ bullet: 'parapet' }, index)).toEqual({ kind: 'bullet', key: 'parapet' })
  })

  it('links a part to the first line whose figure highlights it', () => {
    expect(resolveLink({ part: 'facade' }, index)).toEqual({ kind: 'bullet', key: 'roof' })
  })

  it('links to another figure', () => {
    expect(resolveLink({ figure: 'img-a' }, index)).toEqual({ kind: 'figure', id: 'img-a' })
  })

  it('returns null when nothing matches', () => {
    expect(resolveLink({ part: 'basement' }, index)).toBeNull()
    expect(resolveLink({ bullet: 'missing' }, index)).toBeNull()
  })
})
