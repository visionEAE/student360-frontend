import { Text } from '../atoms'
import { levelLabel, levelTone } from '../../lib/labels'
import { formatDate } from '../../lib/format'
import styles from './WellbeingEntryRow.module.css'

const TONE_STYLE: Record<string, { bg: string; fg: string }> = {
  danger: { bg: 'var(--color-danger-tint)', fg: 'var(--color-danger)' },
  warning: { bg: 'var(--color-warning-tint)', fg: 'var(--color-warning)' },
  success: { bg: 'var(--color-success-tint)', fg: 'var(--color-success)' },
  neutral: { bg: 'var(--color-canvas)', fg: 'var(--color-text-secondary)' },
}

export function WellbeingEntryRow({ level, note, recordedAt }: { level: number; note: string | null; recordedAt: string }) {
  const tone = TONE_STYLE[levelTone(level)]
  return (
    <div className={styles.row}>
      <span className={styles.badge} style={{ background: tone.bg, color: tone.fg }}>
        {levelLabel(level)}
      </span>
      <div className={styles.body}>
        <Text variant="label" color="var(--color-ink)">
          {note ?? 'Sin comentario.'}
        </Text>
        <Text variant="tiny">{formatDate(recordedAt)}</Text>
      </div>
    </div>
  )
}
