import type { RiskLevel, StudentOverviewRow } from '../api/types'

export type SortOrder = 'RISK_DESC' | 'NAME_ASC' | 'UPDATED_DESC'

export interface StudentFilters {
  query: string
  risk: RiskLevel | 'ALL'
  program: string | 'ALL'
  sort: SortOrder
}

export const DEFAULT_FILTERS: StudentFilters = { query: '', risk: 'ALL', program: 'ALL', sort: 'RISK_DESC' }

const RISK_RANK: Record<RiskLevel, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 }

function normalise(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

/** Pure: the table's search, filter and sort — testable without React. */
export function filterStudents(rows: StudentOverviewRow[], filters: StudentFilters): StudentOverviewRow[] {
  const query = normalise(filters.query.trim())
  const filtered = rows.filter((row) => {
    if (filters.risk !== 'ALL' && row.overallRisk !== filters.risk) {
      return false
    }
    if (filters.program !== 'ALL' && row.program !== filters.program) {
      return false
    }
    if (query && !normalise(`${row.fullName} ${row.code}`).includes(query)) {
      return false
    }
    return true
  })
  return [...filtered].sort((a, b) => {
    switch (filters.sort) {
      case 'NAME_ASC':
        return a.fullName.localeCompare(b.fullName, 'es')
      case 'UPDATED_DESC':
        return (b.lastUpdatedAt ?? '').localeCompare(a.lastUpdatedAt ?? '')
      default:
        return RISK_RANK[a.overallRisk] - RISK_RANK[b.overallRisk] || a.fullName.localeCompare(b.fullName, 'es')
    }
  })
}

export interface OverviewCounts {
  total: number
  high: number
  medium: number
  low: number
}

export function countByRisk(rows: StudentOverviewRow[]): OverviewCounts {
  return rows.reduce(
    (counts, row) => {
      counts.total += 1
      if (row.overallRisk === 'HIGH') {
        counts.high += 1
      } else if (row.overallRisk === 'MEDIUM') {
        counts.medium += 1
      } else {
        counts.low += 1
      }
      return counts
    },
    { total: 0, high: 0, medium: 0, low: 0 },
  )
}

export function programsOf(rows: StudentOverviewRow[]): string[] {
  return [...new Set(rows.map((row) => row.program))].sort((a, b) => a.localeCompare(b, 'es'))
}
