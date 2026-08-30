import { Badge } from '../atoms'
import { RISK_LABELS, RISK_TONES, STATUS_LABELS, STATUS_TONES } from '../../lib/labels'
import type { RiskLevel, StatusLevel } from '../../api/types'
import { OctagonAlert, TriangleAlert, CircleCheck } from 'lucide-react'

export function StatusBadge({ status }: { status: StatusLevel }) {
  return <Badge tone={STATUS_TONES[status]}>{STATUS_LABELS[status]}</Badge>
}

const RISK_ICONS = { HIGH: OctagonAlert, MEDIUM: TriangleAlert, LOW: CircleCheck } as const

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <Badge tone={RISK_TONES[risk]} icon={RISK_ICONS[risk]}>
      {RISK_LABELS[risk]}
    </Badge>
  )
}
