import { describe, expect, it } from 'vitest'
import type { Experience, Figure } from '../content/schema'
import {
  focusForBullet,
  indexBullets,
  nextFocus,
  numberFigures,
  pickInitialFigures,
} from './figureVisibility'

const figure = (id: string, type: 'model' | 'image' = 'image'): Figure =>
  type === 'model'
    ? { id, type, caption: '', alt: id }
    : { id, type, src: `/${id}.svg`, caption: '', alt: id }

const figures = [figure('img-a'), figure('model', 'model'), figure('img-b'), figure('img-c')]

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
        partIds: ['roof', 'facade'],
        figures: ['img-b'],
        children: [
          {
            id: 'parapet',
            text: 'Parapet',
            views: [
              { figure: 'model', part: 'roof', azimuth: 30 },
              { figure: 'img-a', region: [0, 0, 50, 50] },
            ],
          },
          { text: 'Drainage, see {fig:img-c}', views: [{ figure: 'model', azimuth: 90 }] },
        ],
      },
      { text: 'Meetings', partIds: [], figures: [], children: [] },
    ],
  },
]

describe('indexBullets', () => {
  const index = indexBullets(experience)

  it('keys bullets by id, or by position when they have none', () => {
    expect([...index.keys()]).toEqual(['roof', 'parapet', 'roof-2', 'studio-2'])
  })

  it('links sub-bullets to their parent', () => {
    expect(index.get('parapet')).toMatchObject({ parentKey: 'roof', sub: { text: 'Parapet' } })
    expect(index.get('roof')?.parentKey).toBeNull()
  })
})

describe('nextFocus', () => {
  const index = indexBullets(experience)

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

describe('pickInitialFigures', () => {
  it('always includes the model first, then random others', () => {
    const picked = pickInitialFigures(figures, () => 0)
    expect(picked).toHaveLength(3)
    expect(picked[0]).toBe('model')
    expect(new Set(picked).size).toBe(3)
  })

  it('varies with the random source', () => {
    expect(pickInitialFigures(figures, () => 0)).not.toEqual(
      pickInitialFigures(figures, () => 0.99),
    )
  })

  it('copes with fewer figures than requested', () => {
    expect(pickInitialFigures([figure('only')], Math.random)).toEqual(['only'])
  })
})

describe('focusForBullet', () => {
  const index = indexBullets(experience)

  it('shows the model (highlighting all parts) and the bullet figures', () => {
    const focus = focusForBullet(index.get('roof')!, 'model')
    expect(focus.figureIds).toEqual(['model', 'img-b'])
    expect(focus.views.model).toEqual({ figure: 'model', parts: ['roof', 'facade'] })
  })

  it('applies sub-bullet views and adds figures they target', () => {
    const focus = focusForBullet(index.get('parapet')!, 'model')
    expect(focus.figureIds).toEqual(['model', 'img-b', 'img-a'])
    expect(focus.views.model).toEqual({ figure: 'model', parts: ['roof'], azimuth: 30 })
    expect(focus.views['img-a']).toEqual({ figure: 'img-a', region: [0, 0, 50, 50] })
  })

  it('includes figures referenced in the text', () => {
    expect(focusForBullet(index.get('roof-2')!, 'model').figureIds).toEqual([
      'model',
      'img-b',
      'img-c',
    ])
  })

  it("keeps the parent's parts when a sub-bullet view sets none", () => {
    const focus = focusForBullet(index.get('roof-2')!, 'model')
    expect(focus.views.model).toEqual({ figure: 'model', parts: ['roof', 'facade'], azimuth: 90 })
  })

  it('shows nothing for a bullet without figures or parts', () => {
    expect(focusForBullet(index.get('studio-2')!, 'model')).toEqual({ figureIds: [], views: {} })
  })
})

describe('numberFigures', () => {
  it('numbers figures by first mention, then the rest in file order', () => {
    const numbers = numberFigures(figures, experience)
    expect(Object.fromEntries(numbers)).toEqual({ 'img-c': 1, model: 2, 'img-b': 3, 'img-a': 4 })
  })
})
