import { describe, expect, it } from 'vitest'
import type { CvView } from './cvView'
import { readUrlState, writeUrlState } from './urlState'

const bullets = ['roof-parapet', 'facade-scripts']
const developerBullets = ['facade-scripts']
const figures = ['section-a-a']
const isBullet = (key: string, view: CvView) =>
  (view === 'developer' ? developerBullets : bullets).includes(key)
const isFigure = (id: string) => figures.includes(id)

describe('readUrlState', () => {
  it('reads a known bullet and figure', () => {
    expect(readUrlState('?b=roof-parapet&fig=section-a-a', isBullet, isFigure)).toEqual({
      view: 'both',
      bullet: 'roof-parapet',
      figure: 'section-a-a',
    })
  })

  it('ignores unknown or missing values', () => {
    expect(readUrlState('?cv=manager&b=attic&fig=nope', isBullet, isFigure)).toEqual({
      view: 'both',
      bullet: null,
      figure: null,
    })
    expect(readUrlState('', isBullet, isFigure)).toEqual({
      view: 'both',
      bullet: null,
      figure: null,
    })
  })

  it('reads the view and keeps only bullets shown in it', () => {
    expect(readUrlState('?cv=developer&b=facade-scripts', isBullet, isFigure)).toMatchObject({
      view: 'developer',
      bullet: 'facade-scripts',
    })
    expect(readUrlState('?cv=developer&b=roof-parapet', isBullet, isFigure).bullet).toBeNull()
  })
})

describe('writeUrlState', () => {
  it('sets every value', () => {
    expect(
      writeUrlState('', { view: 'architect', bullet: 'facade-scripts', figure: 'section-a-a' }),
    ).toBe('?cv=architect&b=facade-scripts&fig=section-a-a')
  })

  it('leaves out the default view', () => {
    expect(writeUrlState('?cv=developer', { view: 'both', bullet: null, figure: null })).toBe('')
  })

  it('removes cleared values and keeps unrelated params', () => {
    expect(writeUrlState('?utm=cv&b=x&fig=y', { view: 'both', bullet: null, figure: null })).toBe(
      '?utm=cv',
    )
  })

  it('drops the legacy part param', () => {
    expect(
      writeUrlState('?part=roof', { view: 'both', bullet: 'roof-parapet', figure: null }),
    ).toBe('?b=roof-parapet')
  })
})
