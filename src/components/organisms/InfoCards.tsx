import { GraduationCap, Laptop, Wallet } from 'lucide-react'
import { Avatar, Badge, Text } from '../atoms'
import { CardHeader, KeyValueList, StatTile, type KeyValueItem } from '../molecules'
import { Card } from './Card'
import type { AcademicStatus, EngagementSignals, FinancialStatus } from '../../api/types'
import { formatCop, formatDate, formatGpa, formatSemesterOf, initialsOf } from '../../lib/format'

export function AcademicStatusCard({ status, programName }: { status: AcademicStatus; programName: string }) {
  const items: KeyValueItem[] = [
    { label: 'Programa', value: programName },
    { label: 'Semestre', value: formatSemesterOf(status.currentSemester, status.totalSemesters) },
    { label: 'Promedio', value: formatGpa(status.cumulativeGpa) },
    { label: 'Créditos en curso', value: status.creditsEnrolled },
  ]
  return (
    <Card>
      <CardHeader icon={GraduationCap} title="Estado académico" right={<Badge tone="info">Matriculada</Badge>} />
      <KeyValueList items={items} />
    </Card>
  )
}

export function FinancialStatusCard({ status }: { status: FinancialStatus }) {
  return (
    <Card>
      <CardHeader
        icon={Wallet}
        title="Estado financiero"
        right={<Badge tone={status.overdue ? 'danger' : 'success'}>{status.overdue ? 'En mora' : 'Al día'}</Badge>}
      />
      <KeyValueList
        items={[
          { label: 'Saldo pendiente', value: formatCop(status.outstandingBalance) },
          { label: 'Fecha límite', value: formatDate(status.dueDate) },
          { label: 'Plan de pago', value: status.paymentPlan ?? 'Ninguno activo' },
          { label: 'Beca', value: status.scholarship ?? 'Sin beca' },
        ]}
      />
    </Card>
  )
}

export function EngagementCard({ signals }: { signals: EngagementSignals }) {
  const disconnected = signals.daysSinceLastAccess !== null && signals.daysSinceLastAccess > 14
  return (
    <Card>
      <CardHeader
        icon={Laptop}
        title="Actividad en la plataforma"
        right={<Badge tone={disconnected ? 'danger' : 'success'}>{disconnected ? 'Desconectada' : 'Conectada'}</Badge>}
      />
      <div style={{ display: 'flex', gap: 10 }}>
        <StatTile
          value={signals.daysSinceLastAccess === null ? '—' : String(signals.daysSinceLastAccess)}
          label="días sin ingresar"
        />
        <StatTile
          value={signals.onTimeSubmissionRate === null ? '—' : `${Math.round(signals.onTimeSubmissionRate * 100)}%`}
          label="entregas a tiempo"
        />
        <StatTile
          value={`${signals.coursesWithoutActivity} de ${signals.activeCourses}`}
          label="cursos sin actividad"
        />
      </div>
    </Card>
  )
}

export function AssignmentCard({ advisorName, since }: { advisorName: string; since: string | null }) {
  return (
    <Card>
      <Text variant="cardTitle">Acompañante asignada</Text>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Avatar initials={initialsOf(advisorName)} size={34} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text variant="label">{advisorName}</Text>
          <Text variant="tiny">{since ? `Activa desde el ${formatDate(since)}` : 'Sin fecha de inicio'}</Text>
        </div>
      </div>
    </Card>
  )
}
