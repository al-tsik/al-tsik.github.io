/** A content date in "YYYY-MM" form, or "present" for ongoing roles. */
export type DateValue = string

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

type YearMonth = { year: number; month: number }

function parseYearMonth(value: string): YearMonth {
  const [year, month] = value.split('-').map(Number)
  return { year, month }
}

function resolve(value: DateValue, now: Date): YearMonth {
  return value === 'present'
    ? { year: now.getFullYear(), month: now.getMonth() + 1 }
    : parseYearMonth(value)
}

/** "2023-03" → "Mar 2023", "present" → "Present". */
export function formatYearMonth(value: DateValue): string {
  if (value === 'present') return 'Present'
  const { year, month } = parseYearMonth(value)
  return `${MONTHS[month - 1]} ${year}`
}

/**
 * Human-readable length of a range, counting both the start and end month
 * (the convention CVs and LinkedIn use): Jun 2021 → Feb 2023 is "1 yr 9 mo".
 * `now` resolves "present" and is a parameter so results are deterministic.
 */
export function formatDuration(start: DateValue, end: DateValue, now: Date = new Date()): string {
  const from = resolve(start, now)
  const to = resolve(end, now)
  const totalMonths = Math.max(1, (to.year - from.year) * 12 + (to.month - from.month) + 1)

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const parts = [years > 0 && `${years} yr`, months > 0 && `${months} mo`].filter(Boolean)

  return parts.join(' ')
}
