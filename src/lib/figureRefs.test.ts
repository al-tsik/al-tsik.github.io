import { describe, expect, it } from 'vitest'
import { figureRefIds, parseFigureRefs } from './figureRefs'

describe('parseFigureRefs', () => {
  it('returns plain text unchanged', () => {
    expect(parseFigureRefs('No figures here.')).toEqual([
      { type: 'text', value: 'No figures here.' },
    ])
  })

  it('splits text around references', () => {
    expect(parseFigureRefs('Set-out (see {fig:section-a-a}).')).toEqual([
      { type: 'text', value: 'Set-out (see ' },
      { type: 'figure', id: 'section-a-a' },
      { type: 'text', value: ').' },
    ])
  })

  it('handles references at the edges and next to each other', () => {
    expect(parseFigureRefs('{fig:a}{fig:b-2}')).toEqual([
      { type: 'figure', id: 'a' },
      { type: 'figure', id: 'b-2' },
    ])
  })

  it('leaves malformed tokens as text', () => {
    expect(parseFigureRefs('{fig:Bad Id} {fig:}')).toEqual([
      { type: 'text', value: '{fig:Bad Id} {fig:}' },
    ])
  })

  it('returns no segments for empty text', () => {
    expect(parseFigureRefs('')).toEqual([])
  })
})

describe('figureRefIds', () => {
  it('lists referenced ids in order', () => {
    expect(figureRefIds('{fig:b} then {fig:a} and {fig:b}')).toEqual(['b', 'a', 'b'])
  })
})
