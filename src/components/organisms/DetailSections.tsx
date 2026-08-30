import { GraduationCap, HeartPulse, Laptop, Wallet } from 'lucide-react'
import { Badge, Divider, Text } from '../atoms'
import { BarChart, CardHeader, DataTable, StatTile, type BarDatum, type DataColumn } from '../molecules'
import { Card } from './Card'
import type {
  AcademicStatus,
  CourseActivity,
  CourseGrade,
  EngagementActivity,
  FinancialStatus,
  Payment,
  WellbeingEntrySummary,
  WellbeingSummary,
} from '../../api/types'
import { PARTICIPATION_LABELS, PARTICIPATION_TONES, levelShortLabel, levelTone, trendLabel, type Tone } from '../../lib/labels'
import { formatCop, formatDate, formatDaysAgo, formatGpa, formatGrade, formatSemesterOf } from '../../lib/format'
import { WellbeingEntryRow } from '../molecules/WellbeingEntryRow'

const TONE_COLOR: Record<string, string> = {
  danger: 'var(--color-danger)',
  warning: 'var(--color-warning)',
  success: 'var(--color-success)',
  neutral: 'var(--color-text-muted)',
}

/** "Estado académico" section of the full Student Information Display. */
export function AcademicSection({ status, programName }: { status: AcademicStatus; programName: string }) {
  const gpaBars: BarDatum[] = status.gpaHistory.map((point) => ({
    label: `Sem ${point.semester}`,
    valueLabel: point.termGpa === null ? '—' : point.termGpa.toFixed(1),
    ratio: point.termGpa === null ? 0 : point.termGpa / 5,
    color: 'var(--color-primary)',
  }))
  const columns: DataColumn<CourseGrade>[] = [
    { key: 'name', header: 'Materia', render: (row) => row.name },
    { key: 'credits', header: 'Créditos', width: 70, render: (row) => row.credits },
    {
      key: 'grade',
      header: 'Nota acumulada',
      width: 110,
      render: (row) => (
        <Text variant="label" color={row.currentGrade !== null && row.currentGrade < 3 ? 'var(--color-warning)' : 'var(--color-ink)'}>
          {formatGrade(row.currentGrade)}
        </Text>
      ),
    },
  ]
  return (
    <Card>
      <CardHeader icon={GraduationCap} title="Estado académico" caption={`Fuente: SIS · al ${formatDate(status.sourceUpdatedAt)}`} />
      <StatRow
        items={[
          { value: programName, label: 'Programa' },
          { value: formatSemesterOf(status.currentSemester, status.totalSemesters), label: 'Semestre' },
          { value: formatGpa(status.cumulativeGpa), label: 'Promedio' },
          { value: status.enrollmentStatus === 'ACTIVE' ? 'Activa' : (status.enrollmentStatus ?? '—'), label: 'Matrícula' },
          { value: String(status.creditsEnrolled), label: 'Créditos en curso' },
        ]}
      />
      <div style={{ display: 'flex', gap: 28 }}>
        <div style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Text variant="label">Evolución del promedio por semestre</Text>
          <BarChart data={gpaBars} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
          <Text variant="label">Materias actuales</Text>
          <DataTable columns={columns} rows={status.currentCourses} rowKey={(row) => row.code} emptyLabel="Sin materias registradas." />
        </div>
      </div>
    </Card>
  )
}

/** "Estado financiero" section, including the payment history and the balance bar. */
export function FinancialSection({ status }: { status: FinancialStatus }) {
  const paidRatio = status.tuitionAmount ? (status.paidAmount ?? 0) / status.tuitionAmount : 0
  const columns: DataColumn<Payment>[] = [
    { key: 'date', header: 'Fecha', width: 140, render: (row) => formatDate(row.date) },
    { key: 'description', header: 'Descripción', render: (row) => row.description },
    { key: 'amount', header: 'Valor', width: 150, render: (row) => formatCop(row.amount, false) },
    {
      key: 'status',
      header: 'Estado',
      width: 110,
      render: (row) => (
        <Text variant="label" color={row.status === 'PAID' ? 'var(--color-success)' : row.status === 'OVERDUE' ? 'var(--color-danger)' : 'var(--color-warning)'}>
          {row.status === 'PAID' ? 'Pagado' : row.status === 'OVERDUE' ? 'Vencida' : 'Pendiente'}
        </Text>
      ),
    },
  ]
  return (
    <Card>
      <CardHeader icon={Wallet} title="Estado financiero" caption={`Fuente: ERP · al ${formatDate(status.updatedAt)}`} />
      <StatRow
        items={[
          { value: formatCop(status.overdueBalance || status.outstandingBalance), label: 'Saldo pendiente', tone: status.overdue ? 'danger' : undefined },
          { value: formatDate(status.dueDate), label: 'Fecha límite' },
          { value: status.paymentPlan ?? 'Ninguno activo', label: 'Plan de pago' },
          { value: status.scholarship ?? 'Sin beca', label: 'Beca' },
        ]}
      />
      {status.tuitionAmount ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Text variant="label">Matrícula del semestre: {formatCop(status.tuitionAmount)}</Text>
          <div
            style={{
              width: '100%',
              maxWidth: 500,
              height: 22,
              borderRadius: 6,
              background: 'var(--color-danger-tint)',
              overflow: 'hidden',
            }}
          >
            <div style={{ width: `${Math.min(100, paidRatio * 100)}%`, height: '100%', background: 'var(--color-success)' }} />
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <Legend color="var(--color-success)" text={`Pagado: ${formatCop(status.paidAmount ?? 0)} (${Math.round(paidRatio * 100)}%)`} />
            <Legend
              color="var(--color-danger)"
              text={`Pendiente: ${formatCop(status.outstandingBalance)} (${Math.round((1 - paidRatio) * 100)}%)`}
            />
          </div>
        </div>
      ) : null}
      <Text variant="label">Historial de pagos</Text>
      <DataTable columns={columns} rows={status.payments} rowKey={(row) => `${row.date}-${row.description}`} emptyLabel="Sin pagos registrados." />
    </Card>
  )
}

/** "Actividad en la plataforma" section: metrics plus the per-course activity table. */
export function EngagementSection({ activity }: { activity: EngagementActivity }) {
  const columns: DataColumn<CourseActivity>[] = [
    { key: 'course', header: 'Materia', render: (row) => row.courseName },
    { key: 'last', header: 'Último ingreso', width: 120, render: (row) => formatDaysAgo(row.daysSinceLastAccess) },
    { key: 'onTime', header: 'A tiempo', width: 80, render: (row) => row.onTime },
    { key: 'late', header: 'Tarde', width: 70, render: (row) => row.late },
    { key: 'missing', header: 'No entregado', width: 80, render: (row) => row.missing },
    {
      key: 'participation',
      header: 'Participación',
      width: 120,
      render: (row) => (
        <Text variant="label" color={`var(--color-${PARTICIPATION_TONES[row.participation] === 'danger' ? 'danger' : PARTICIPATION_TONES[row.participation] === 'warning' ? 'warning' : 'success'})`}>
          {PARTICIPATION_LABELS[row.participation]}
        </Text>
      ),
    },
  ]
  const onTimeRate = activity.submissions.onTime + activity.submissions.late + activity.submissions.missing
    ? activity.submissions.onTime / (activity.submissions.onTime + activity.submissions.late + activity.submissions.missing)
    : null

  return (
    <Card>
      <CardHeader icon={Laptop} title="Actividad en la plataforma" caption={`Fuente: plataforma educativa · últimos ${activity.windowDays} días`} />
      <StatRow
        items={[
          {
            value: activity.lastAccessAt ? formatDaysAgo(daysSince(activity.lastAccessAt)) : 'Sin ingresos',
            label: 'Días sin ingresar',
            tone: 'danger',
          },
          { value: onTimeRate === null ? '—' : `${Math.round(onTimeRate * 100)}%`, label: 'Entregas a tiempo' },
          {
            value: `${activity.courses.filter((c) => c.participation !== 'INACTIVE').length} de ${activity.courses.length}`,
            label: 'Cursos sin actividad',
            tone: 'warning',
          },
          { value: String(activity.accessCount), label: `Ingresos (${activity.windowDays} d)` },
        ]}
      />
      <Text variant="label">Actividad por materia</Text>
      <DataTable columns={columns} rows={activity.courses} rowKey={(row) => row.courseCode} emptyLabel="Sin actividad registrada." />
    </Card>
  )
}

/** "Bienestar" section: weekly trend chart and the recent self-reported entries. */
export function WellbeingSection({ summary }: { summary: WellbeingSummary }) {
  const trend = trendLabel(summary.trend)
  const bars: BarDatum[] = summary.weekly.map((week, index) => ({
    label: `S${index + 1}`,
    valueLabel: levelShortLabel(week.level),
    // A week with no entry omits `level` from the JSON entirely rather than nulling it, so
    // `typeof` catches that `undefined` case too — `=== null` alone left it as NaN (bar height).
    ratio: typeof week.level === 'number' ? week.level / 4 : 0,
    color: TONE_COLOR[levelTone(week.level)],
  }))
  return (
    <Card>
      <CardHeader
        icon={HeartPulse}
        title="Bienestar"
        caption="Autorreportado por la estudiante · seudonimizado en el sistema de acompañamiento"
      />
      <StatRow
        items={[
          { value: summary.currentLevel === null ? 'Sin registro' : (summary.currentLevel <= 1 ? 'Bajo' : summary.currentLevel === 2 ? 'Medio' : 'Bien'), label: 'Nivel actual', tone: levelTone(summary.currentLevel) },
          { value: String(summary.entriesThisMonth), label: 'Registros este mes' },
          { value: trend.label, label: 'Tendencia', tone: trend.tone === 'neutral' ? undefined : trend.tone },
        ]}
      />
      <div style={{ display: 'flex', gap: 28 }}>
        <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Text variant="label">Nivel por semana (últimas 6 semanas)</Text>
          <BarChart data={bars} barWidth={34} maxHeight={70} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Text variant="label">Registros recientes</Text>
          <RecentEntries entries={summary.recent} />
        </div>
      </div>
    </Card>
  )
}

function RecentEntries({ entries }: { entries: WellbeingEntrySummary[] }) {
  if (entries.length === 0) {
    return <Text variant="caption">Todavía no hay registros.</Text>
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {entries.map((entry) => (
        <WellbeingEntryRow key={entry.entryId} level={entry.level} note={entry.summaryNote} recordedAt={entry.recordedAt} />
      ))}
    </div>
  )
}

function StatRow({ items }: { items: { value: string; label: string; tone?: Tone }[] }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {items.map((item) => (
        <StatTile key={item.label} value={item.value} label={item.label} tone={item.tone} />
      ))}
    </div>
  )
}

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
      <Text variant="body">{text}</Text>
    </div>
  )
}

function daysSince(dateIso: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(dateIso).getTime()) / 86400000))
}

export { Badge, Divider }
