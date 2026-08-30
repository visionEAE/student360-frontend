import { ArrowDownWideNarrow, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Input } from '../atoms'
import { DataTable, FilterPill, StatusBadge, RiskBadge, StudentCell, type DataColumn } from '../molecules'
import type { RiskLevel, StudentOverviewRow } from '../../api/types'
import { DEFAULT_FILTERS, filterStudents, programsOf } from '../../lib/students'
import { formatRelative } from '../../lib/format'

const RISK_OPTIONS: { value: RiskLevel | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Nivel de riesgo' },
  { value: 'HIGH', label: 'Riesgo alto' },
  { value: 'MEDIUM', label: 'Riesgo medio' },
  { value: 'LOW', label: 'Riesgo bajo' },
]

export function StudentsTable({ rows }: { rows: StudentOverviewRow[] }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const navigate = useNavigate()
  const programs = useMemo(() => programsOf(rows), [rows])
  const visible = useMemo(() => filterStudents(rows, filters), [rows, filters])

  const columns: DataColumn<StudentOverviewRow>[] = [
    { key: 'student', header: 'Estudiante', width: 280, render: (row) => <StudentCell fullName={row.fullName} code={row.code} /> },
    { key: 'program', header: 'Programa', width: 190, render: (row) => row.program },
    { key: 'academic', header: 'Académico', width: 110, render: (row) => <StatusBadge status={row.academicStatus} /> },
    { key: 'financial', header: 'Financiero', width: 110, render: (row) => <StatusBadge status={row.financialStatus} /> },
    { key: 'emotional', header: 'Emocional', width: 110, render: (row) => <StatusBadge status={row.emotionalStatus} /> },
    { key: 'overall', header: 'Riesgo general', width: 130, render: (row) => <RiskBadge risk={row.overallRisk} /> },
    { key: 'updated', header: 'Última actualización', width: 120, render: (row) => formatRelative(row.lastUpdatedAt) },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Input
          leadingIcon={Search}
          surface
          placeholder="Buscar por nombre o código..."
          style={{ width: 320 }}
          value={filters.query}
          onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
          aria-label="Buscar estudiantes por nombre o código"
        />
        <FilterPill
          value={filters.risk}
          onChange={(value) => setFilters((current) => ({ ...current, risk: value as RiskLevel | 'ALL' }))}
          options={RISK_OPTIONS}
        />
        <FilterPill
          value={filters.program}
          onChange={(value) => setFilters((current) => ({ ...current, program: value }))}
          options={[{ value: 'ALL', label: 'Programa' }, ...programs.map((program) => ({ value: program, label: program }))]}
        />
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)', fontSize: 13, fontWeight: 600 }}>
          Ordenar: mayor riesgo primero
          <Icon icon={ArrowDownWideNarrow} size={14} color="var(--color-text-muted)" />
        </span>
      </div>
      <DataTable
        columns={columns}
        rows={visible}
        rowKey={(row) => row.studentId}
        onRowClick={(row) => navigate(`/advisor/students/${row.studentId}`)}
        emptyLabel="Ningún estudiante coincide con los filtros."
      />
    </div>
  )
}
