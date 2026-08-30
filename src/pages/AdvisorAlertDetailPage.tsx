import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Spinner, TextArea, Text, Button } from '../components/atoms'
import { ErrorNotice } from '../components/molecules'
import { AppShell, StackLayout } from '../components/templates'
import { ActiveAlertCard, InterventionPlanCard, Topbar } from '../components/organisms'
import { supportApi } from '../api/support'
import { useLoad } from '../lib/useLoad'

export function AdvisorAlertDetailPage() {
  const { alertId = '' } = useParams()
  const navigate = useNavigate()
  const { data, loading, error, reload } = useLoad(() => supportApi.alert(alertId), [alertId])
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)

  if (loading) {
    return (
      <AppShell>
        <Spinner center />
      </AppShell>
    )
  }
  if (error || !data) {
    return (
      <AppShell>
        <ErrorNotice error={error} />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <StackLayout>
        <Topbar backLabel="Alertas" onBack={() => navigate('/advisor/alerts')} />
        <ActiveAlertCard alert={data} />
        {data.interventionPlan ? (
          <InterventionPlanCard
            plan={data.interventionPlan}
            onAccept={
              data.interventionPlan.status === 'PROPOSED'
                ? () => supportApi.updateInterventionPlanStatus(data.interventionPlan!.id, 'ACTIVE').then(reload)
                : undefined
            }
            onAddNote={(content) => supportApi.addReport(data.id, content).then(() => reload())}
          />
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 22, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14 }}>
          <Text variant="cardTitle">Reportes de acompañamiento</Text>
          {data.reports.length === 0 ? (
            <Text variant="caption">Todavía no hay reportes para esta alerta.</Text>
          ) : (
            data.reports.map((report) => (
              <div key={report.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 10, borderBottom: '1px solid var(--color-border)' }}>
                <Text variant="body">{report.content}</Text>
                <Text variant="tiny">{new Date(report.createdAt).toLocaleString('es-CO')}</Text>
              </div>
            ))
          )}
          <TextArea placeholder="Nuevo reporte…" value={note} onChange={(event) => setNote(event.target.value)} />
          <Button
            size="sm"
            disabled={!note.trim() || sending}
            onClick={() => {
              setSending(true)
              supportApi
                .addReport(data.id, note.trim())
                .then(() => {
                  setNote('')
                  reload()
                })
                .finally(() => setSending(false))
            }}
          >
            {sending ? 'Guardando…' : 'Agregar reporte'}
          </Button>
        </div>
      </StackLayout>
    </AppShell>
  )
}
