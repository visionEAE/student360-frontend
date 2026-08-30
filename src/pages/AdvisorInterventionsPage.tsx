import { Spinner, Text } from '../components/atoms'
import { DataTable, EmptyState, ErrorNotice, type DataColumn } from '../components/molecules'
import { AppShell, StackLayout } from '../components/templates'
import { supportApi } from '../api/support'
import { useLoad } from '../lib/useLoad'
import type { InterventionPlan } from '../api/types'
import { PLAN_STATUS_LABELS, PLAN_TYPE_LABELS } from '../lib/labels'
import { Button } from '../components/atoms'

export function AdvisorInterventionsPage() {
  const { data, loading, error, reload } = useLoad(() => supportApi.interventionPlans(), [])

  const columns: DataColumn<InterventionPlan>[] = [
    { key: 'student', header: 'Estudiante', render: (row) => row.studentName ?? row.studentId ?? '—' },
    { key: 'type', header: 'Tipo', render: (row) => PLAN_TYPE_LABELS[row.type] },
    { key: 'description', header: 'Descripción', render: (row) => row.description },
    { key: 'status', header: 'Estado', width: 140, render: (row) => PLAN_STATUS_LABELS[row.status] },
    {
      key: 'action',
      header: '',
      width: 140,
      render: (row) =>
        row.status === 'PROPOSED' ? (
          <Button size="sm" variant="secondary" onClick={() => supportApi.updateInterventionPlanStatus(row.id, 'ACTIVE').then(reload)}>
            Aceptar
          </Button>
        ) : row.status === 'ACTIVE' ? (
          <Button size="sm" variant="secondary" onClick={() => supportApi.updateInterventionPlanStatus(row.id, 'COMPLETED').then(reload)}>
            Completar
          </Button>
        ) : null,
    },
  ]

  return (
    <AppShell>
      <StackLayout>
        <Text variant="pageTitle">Intervenciones</Text>
        {loading ? <Spinner center /> : null}
        {error ? <ErrorNotice error={error} /> : null}
        {data ? data.length === 0 ? <EmptyState label="No hay rutas de intervención registradas." /> : <DataTable columns={columns} rows={data} rowKey={(row) => row.id} /> : null}
      </StackLayout>
    </AppShell>
  )
}
