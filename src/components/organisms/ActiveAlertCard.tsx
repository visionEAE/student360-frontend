import { OctagonAlert } from 'lucide-react'
import { Badge, Divider, Icon, Text } from '../atoms'
import { SignalRow } from '../molecules'
import { Card } from './Card'
import type { AlertDetail } from '../../api/types'
import { ALERT_STATUS_LABELS, SEVERITY_TITLES } from '../../lib/labels'
import { formatDateTime } from '../../lib/format'
import { describeSignals } from '../../lib/signals'
import styles from './ActiveAlertCard.module.css'

export function ActiveAlertCard({ alert }: { alert: AlertDetail }) {
  const sentences = describeSignals(alert.triggeringSignals, alert.generatedAt)
  return (
    <Card tint>
      <div className={styles.top}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <Icon icon={OctagonAlert} size={20} color="var(--color-danger)" />
            <Text variant="cardTitle" color="var(--color-danger)">
              {SEVERITY_TITLES[alert.severity]}
            </Text>
          </div>
          <Text variant="caption" color="var(--color-danger-text, #a33a3a)">
            Generada el {formatDateTime(alert.generatedAt)} · Fuente: {alert.source === 'ADVISOR' ? 'acompañante' : 'motor de reglas'}
          </Text>
        </div>
        <Badge tone="danger" onTint size="md">
          {ALERT_STATUS_LABELS[alert.status]}
        </Badge>
      </div>
      <Divider tint="#d94f4f33" />
      <Text variant="label">Por qué se generó esta alerta</Text>
      <div className={styles.list}>
        {sentences.map((sentence) => (
          <SignalRow key={sentence.code} title={sentence.title} detail={sentence.detail} />
        ))}
      </div>
    </Card>
  )
}
