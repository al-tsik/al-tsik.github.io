import { describe, expect, it } from 'vitest'
import { formatDateRange, formatDuration, formatYearMonth } from './dates'

describe('formatYearMonth', () => {
  it('formats YYYY-MM as short month and year', () => {
    expect(formatYearMonth('2023-03')).toBe('Mar 2023')
    expect(formatYearMonth('2019-12')).toBe('Dec 2019')
  })

  it('formats "present"', () => {
    expect(formatYearMonth('present')).toBe('Present')
  })
})

describe('formatDateRange', () => {
  it('joins start and end with an em dash', () => {
    expect(formatDateRange('2021-06', '2023-02')).toBe('Jun 2021 — Feb 2023')
    expect(formatDateRange('2023-03', 'present')).toBe('Mar 2023 — Present')
  })
})

describe('formatDuration', () => {
  const now = new Date(2026, 9, 7) // 7 Oct 2026 (months are 0-based)

  it('counts start and end months inclusively', () => {
    expect(formatDuration('2021-06', '2023-02', now)).toBe('1 yr 9 mo')
  })

  it('omits zero parts', () => {
    expect(formatDuration('2022-01', '2022-12', now)).toBe('1 yr')
    expect(formatDuration('2022-01', '2022-03', now)).toBe('3 mo')
  })

  it('treats a single month as one month', () => {
    expect(formatDuration('2022-05', '2022-05', now)).toBe('1 mo')
  })

  it('resolves "present" against the given date', () => {
    expect(formatDuration('2023-03', 'present', now)).toBe('3 yr 8 mo')
  })
})
