import { CircleCheck, TriangleAlert, Users } from 'lucide-react'
import type { OverviewCounts } from '../../lib/students'
import { Icon, Text } from '../atoms'
import styles from './SummaryChips.module.css'

export function SummaryChips({ counts }: { counts: OverviewCounts }) {
  const items = [
    { icon: Users, count: counts.total, label: 'Total de estudiantes', color: 'var(--color-ink)', tint: false },
    { icon: TriangleAlert, count: counts.high, label: 'Riesgo alto', color: 'var(--color-danger)', tint: true, bg: 'var(--color-danger-tint)' },
    { icon: TriangleAlert, count: counts.medium, label: 'Riesgo medio', color: 'var(--color-warning)', tint: true, bg: 'var(--color-warning-tint)' },
    { icon: CircleCheck, count: counts.low, label: 'Al día', color: 'var(--color-success)', tint: true, bg: 'var(--color-success-tint)' },
  ]
  return (
    <div className={styles.row}>
      {items.map((item) => (
        <div key={item.label} className={`${styles.chip} ${item.tint ? styles.tint : ''}`} style={item.bg ? { background: item.bg } : undefined}>
          <span className={styles.iconWrap}>
            <Icon icon={item.icon} size={17} color={item.color} />
          </span>
          <div>
            <Text variant="body" as="span" className={styles.count} style={{ color: item.color }}>
              {item.count}
            </Text>
            <Text variant="caption" style={{ color: item.tint ? item.color : undefined, fontWeight: 600 }}>
              {item.label}
            </Text>
          </div>
        </div>
      ))}
    </div>
  )
}
