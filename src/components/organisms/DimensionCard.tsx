import { GraduationCap, HeartPulse, Wallet } from 'lucide-react'
import type { Dimension, Mood } from '../../api/types'
import { Icon, MoodPill, TextArea, Text, Chip } from '../atoms'
import { DIMENSION_LABELS, NEEDS_BY_DIMENSION } from '../../lib/labels'
import type { DimensionFormState } from '../../lib/wellbeing'
import { Card } from './Card'
import styles from './DimensionCard.module.css'

const DIMENSION_ICONS = { ECONOMIC: Wallet, ACADEMIC: GraduationCap, EMOTIONAL: HeartPulse } as const
const MOODS: Mood[] = ['DIFFICULT', 'FAIR', 'GOOD', 'VERY_GOOD']

interface DimensionCardProps {
  dimension: Dimension
  state: DimensionFormState
  onChange: (next: DimensionFormState) => void
  disabled?: boolean
}

/** One of the three "Económico / Académico / Emocional" cards of the safe space form. */
export function DimensionCard({ dimension, state, onChange, disabled }: DimensionCardProps) {
  const meta = DIMENSION_LABELS[dimension]
  return (
    <Card>
      <div className={styles.top}>
        <span className={styles.iconWrap}>
          <Icon icon={DIMENSION_ICONS[dimension]} size={19} />
        </span>
        <div className={styles.titleCol}>
          <Text variant="cardTitle">{meta.title}</Text>
          <Text variant="tiny">{meta.caption}</Text>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Text variant="label">¿Cómo te sientes con esto?</Text>
        <div className={styles.moodRow}>
          {MOODS.map((mood) => (
            <MoodPill
              key={mood}
              mood={mood}
              selected={state.mood === mood}
              onSelect={() => !disabled && onChange({ ...state, mood })}
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Text variant="label">¿Qué necesitas ahora?</Text>
        <div className={styles.chipsRow}>
          {NEEDS_BY_DIMENSION[dimension].map((need) => (
            <Chip
              key={need.code}
              label={need.label}
              selected={state.needs.includes(need.code)}
              onToggle={disabled ? undefined : () => onChange({ ...state, needs: toggle(state.needs, need.code) })}
            />
          ))}
        </div>
      </div>
      <TextArea
        placeholder="Cuéntanos más si quieres (opcional)..."
        value={state.note}
        disabled={disabled}
        onChange={(event) => onChange({ ...state, note: event.target.value })}
      />
    </Card>
  )
}

function toggle(needs: string[], code: string): string[] {
  if (needs.includes(code)) {
    return needs.filter((need) => need !== code)
  }
  return code === 'NOTHING' ? ['NOTHING'] : [...needs.filter((need) => need !== 'NOTHING'), code]
}
