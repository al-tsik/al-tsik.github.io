import { describe, expect, it } from 'vitest'
import { readUrlState, writeUrlState } from './urlState'

const bullets = ['roof-parapet', 'facade-scripts']
const figures = ['section-a-a']
const isBullet = (key: string) => bullets.includes(key)
const isFigure = (id: string) => figures.includes(id)

describe('readUrlState', () => {
  it('reads a known bullet and figure', () => {
    expect(readUrlState('?b=roof-parapet&fig=section-a-a', isBullet, isFigure)).toEqual({
      bullet: 'roof-parapet',
      figure: 'section-a-a',
    })
  })

  it('ignores unknown or missing values', () => {
    expect(readUrlState('?b=attic&fig=nope', isBullet, isFigure)).toEqual({
      bullet: null,
      figure: null,
    })
    expect(readUrlState('', isBullet, isFigure)).toEqual({ bullet: null, figure: null })
  })
})

describe('writeUrlState', () => {
  it('sets both values', () => {
    expect(writeUrlState('', { bullet: 'facade-scripts', figure: 'section-a-a' })).toBe(
      '?b=facade-scripts&fig=section-a-a',
    )
  })

  it('removes cleared values and keeps unrelated params', () => {
    expect(writeUrlState('?utm=cv&b=x&fig=y', { bullet: null, figure: null })).toBe('?utm=cv')
  })

  it('drops the legacy part param', () => {
    expect(writeUrlState('?part=roof', { bullet: 'roof-parapet', figure: null })).toBe(
      '?b=roof-parapet',
    )
  })
})
