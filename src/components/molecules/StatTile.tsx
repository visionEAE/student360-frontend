import type { Tone } from '../../lib/labels'
import styles from './StatTile.module.css'

const TONE_COLORS: Record<Tone, string | undefined> = {
  danger: 'var(--color-danger)',
  warning: 'var(--color-warning)',
  success: 'var(--color-success)',
  info: 'var(--color-info-text)',
  primary: 'var(--color-primary)',
  neutral: undefined,
}

export function StatTile({ value, label, tone = 'neutral' }: { value: string; label: string; tone?: Tone }) {
  return (
    <div className={styles.tile}>
      <span className={styles.value} style={{ color: TONE_COLORS[tone] ?? 'var(--color-ink)' }}>
        {value}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
