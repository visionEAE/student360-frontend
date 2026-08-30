import { describe, expect, it } from 'vitest'
import {
  firstName,
  formatCop,
  formatDate,
  formatDateTime,
  formatDaysAgo,
  formatPercent,
  formatRelative,
  formatSemester,
  formatSemesterOf,
  initialsOf,
} from './format'

describe('format helpers (design copy)', () => {
  it('formats colombian pesos with dot separators', () => {
    expect(formatCop(1240000)).toBe('$1.240.000 COP')
    expect(formatCop(600000, false)).toBe('$600.000')
    expect(formatCop(0)).toBe('$0 COP')
    expect(formatCop(null)).toBe('—')
  })

  it('formats dates the way the design does', () => {
    expect(formatDate('2026-08-28T14:14:00Z')).toBe('28 ago. 2026')
    expect(formatDate('2026-02-03T12:00:00Z')).toBe('03 feb. 2026')
    expect(formatDateTime(new Date(2026, 7, 28, 9, 14))).toBe('28 ago. 2026 · 09:14 a. m.')
    expect(formatDate(null)).toBe('—')
  })

  it('formats relative times with the design granularity', () => {
    const now = new Date('2026-08-30T12:00:00Z')
    expect(formatRelative('2026-08-30T10:00:00Z', now)).toBe('Hace 2 h')
    expect(formatRelative('2026-08-29T11:00:00Z', now)).toBe('Hace 1 d')
    expect(formatRelative('2026-08-23T12:00:00Z', now)).toBe('Hace 1 sem')
    expect(formatRelative('2026-08-30T11:58:00Z', now)).toBe('Hace 2 min')
    expect(formatDaysAgo(3)).toBe('Hace 3 días')
    expect(formatDaysAgo(null)).toBe('Sin ingresos')
  })

  it('formats semesters, percentages and initials', () => {
    expect(formatSemesterOf(7, 10)).toBe('7.º de 10')
    expect(formatSemester(7)).toBe('7.º semestre')
    expect(formatPercent(0.62)).toBe('62%')
    expect(formatPercent(null)).toBe('—')
    expect(initialsOf('María José Restrepo')).toBe('MR')
    expect(initialsOf('Laura Cárdenas')).toBe('LC')
    expect(initialsOf('')).toBe('?')
    expect(firstName('María José Restrepo')).toBe('María José')
    expect(firstName('Laura Cárdenas')).toBe('Laura')
  })
})
