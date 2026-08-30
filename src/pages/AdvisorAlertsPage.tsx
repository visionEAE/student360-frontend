import { useNavigate } from 'react-router-dom'
import { Spinner, Text } from '../components/atoms'
import { DataTable, EmptyState, ErrorNotice, RiskBadge, type DataColumn } from '../components/molecules'
import { AppShell, StackLayout } from '../components/templates'
import { supportApi } from '../api/support'
import { useLoad } from '../lib/useLoad'
import type { AlertSummary } from '../api/types'
import { ALERT_STATUS_LABELS } from '../lib/labels'
import { formatDateTime } from '../lib/format'

export function AdvisorAlertsPage() {
  const navigate = useNavigate()
  const { data, loading, error } = useLoad(() => supportApi.alerts(), [])

  const columns: DataColumn<AlertSummary>[] = [
    { key: 'student', header: 'Estudiante', render: (row) => row.studentId },
    { key: 'severity', header: 'Severidad', width: 130, render: (row) => <RiskBadge risk={row.severity === 'HIGH' ? 'HIGH' : 'MEDIUM'} /> },
    { key: 'status', header: 'Estado', width: 130, render: (row) => ALERT_STATUS_LABELS[row.status] },
    { key: 'generatedAt', header: 'Generada', width: 200, render: (row) => formatDateTime(row.generatedAt) },
    { key: 'conditions', header: 'Señales', render: (row) => row.firedConditions.length },
  ]

  return (
    <AppShell>
      <StackLayout>
        <Text variant="pageTitle">Alertas</Text>
        {loading ? <Spinner center /> : null}
        {error ? <ErrorNotice error={error} /> : null}
        {data ? (
          data.length === 0 ? (
            <EmptyState label="No hay alertas abiertas." />
          ) : (
            <DataTable columns={columns} rows={data} rowKey={(row) => row.id} onRowClick={(row) => navigate(`/advisor/alerts/${row.id}`)} />
          )
        ) : null}
      </StackLayout>
    </AppShell>
  )
}
