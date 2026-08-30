import { Spinner, Text } from '../components/atoms'
import { DataTable, EmptyState, ErrorNotice, type DataColumn } from '../components/molecules'
import { AppShell, StackLayout } from '../components/templates'
import { supportApi } from '../api/support'
import { useLoad } from '../lib/useLoad'
import type { SupportReport } from '../api/types'
import { formatDateTime } from '../lib/format'

export function AdvisorReportsPage() {
  const { data, loading, error } = useLoad(() => supportApi.reports(), [])

  const columns: DataColumn<SupportReport>[] = [
    { key: 'student', header: 'Estudiante', width: 160, render: (row) => row.studentId ?? '—' },
    { key: 'content', header: 'Reporte', render: (row) => row.content },
    { key: 'createdAt', header: 'Fecha', width: 200, render: (row) => formatDateTime(row.createdAt) },
  ]

  return (
    <AppShell>
      <StackLayout>
        <Text variant="pageTitle">Reportes</Text>
        {loading ? <Spinner center /> : null}
        {error ? <ErrorNotice error={error} /> : null}
        {data ? data.length === 0 ? <EmptyState label="No hay reportes registrados todavía." /> : <DataTable columns={columns} rows={data} rowKey={(row) => row.id} /> : null}
      </StackLayout>
    </AppShell>
  )
}
