import { describe, expect, it } from 'vitest'
import type { StudentOverviewRow } from '../api/types'
import { countByRisk, DEFAULT_FILTERS, filterStudents, programsOf } from './students'

function row(partial: Partial<StudentOverviewRow> & Pick<StudentOverviewRow, 'studentId' | 'fullName' | 'overallRisk'>): StudentOverviewRow {
  return {
    code: '2020',
    initials: 'XX',
    program: 'Psicología',
    currentSemester: 5,
    academicStatus: 'ON_TRACK',
    financialStatus: 'ON_TRACK',
    emotionalStatus: 'ON_TRACK',
    openAlertId: null,
    lastUpdatedAt: '2026-08-30T10:00:00Z',
    ...partial,
  }
}

const rows = [
  row({ studentId: 'S-1', fullName: 'Valentina Ospina', overallRisk: 'LOW', program: 'Diseño', code: '2021077310' }),
  row({ studentId: 'S-2', fullName: 'María José Restrepo', overallRisk: 'HIGH', program: 'Administración' }),
  row({ studentId: 'S-3', fullName: 'Juan Pablo Gómez', overallRisk: 'MEDIUM', program: 'Sistemas' }),
  row({ studentId: 'S-4', fullName: 'Daniel Herrera', overallRisk: 'HIGH', program: 'Medicina' }),
]

describe('students table logic', () => {
  it('sorts highest risk first by default, then by name', () => {
    expect(filterStudents(rows, DEFAULT_FILTERS).map((r) => r.studentId)).toEqual(['S-4', 'S-2', 'S-3', 'S-1'])
  })

  it('searches by name or code ignoring accents and case', () => {
    expect(filterStudents(rows, { ...DEFAULT_FILTERS, query: 'maria' }).map((r) => r.studentId)).toEqual(['S-2'])
    expect(filterStudents(rows, { ...DEFAULT_FILTERS, query: '2021077' }).map((r) => r.studentId)).toEqual(['S-1'])
  })

  it('filters by risk and program', () => {
    expect(filterStudents(rows, { ...DEFAULT_FILTERS, risk: 'HIGH' })).toHaveLength(2)
    expect(filterStudents(rows, { ...DEFAULT_FILTERS, program: 'Medicina' }).map((r) => r.studentId)).toEqual(['S-4'])
  })

  it('counts by risk and lists programs', () => {
    expect(countByRisk(rows)).toEqual({ total: 4, high: 2, medium: 1, low: 1 })
    expect(programsOf(rows)).toEqual(['Administración', 'Diseño', 'Medicina', 'Sistemas'])
  })
})
